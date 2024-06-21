from flask import Flask, send_file, request, jsonify
import os
import requests
import win32print
import win32api
import sqlite3
import time
from threading import Thread

app = Flask(__name__)

UPLOAD_FOLDER = 'shop_upload'
DATABASE = 'printer.db'

CHECK_INTERVAL = 60

def print_file(file_path, printer_name, paper_size, orientation, copies, page_range):
    try:
        hprinter = win32print.OpenPrinter(printer_name)
        try:
            printer_info = win32print.GetPrinter(hprinter, 2)
            devmode = printer_info["pDevMode"]
            devmode.PaperSize = get_paper_size_code(paper_size)
            devmode.Orientation = 1 if orientation == 'portrait' else 2  # 1 = Portrait, 2 = Landscape
            devmode.Copies = copies

            if not page_range:
                win32api.ShellExecute(
                    0,
                    "print",
                    file_path,
                    None,
                    ".",
                    0
                )
            else:
                pages = parse_page_range(page_range)
                for page in pages:
                    win32api.ShellExecute(
                        0,
                        "print",
                        file_path,
                        f"/p:{page}",
                        ".",
                        0
                    )
        finally:
            win32print.ClosePrinter(hprinter)
    except Exception as e:
        print(e)
        raise

def check_printer_status(printer_name):
    try:
        hprinter = win32print.OpenPrinter(printer_name)
        try:
            printer_info = win32print.GetPrinter(hprinter, 2)
            return True  
        finally:
            win32print.ClosePrinter(hprinter)
    except Exception as e:
        print(e)
        return False  

def add_to_queue(file_id, file_path, printer_name, paper_size, orientation, copies, page_range):
    try:
        conn = sqlite3.connect(DATABASE)
        cursor = conn.cursor()
        cursor.execute("""
            INSERT INTO print_queue (file_id, file_path, printer_name, paper_size, orientation, copies, page_range, status)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        """, (file_id, file_path, printer_name, paper_size, orientation, copies, page_range, 'waiting'))
        conn.commit()

        update_url = 'http://localhost:3000/shop/update'
        status_data = {'file_id': file_id, 'status': 'Waiting'}
        response = requests.post(update_url, json=status_data)

        if response.status_code != 200:
            print(f"Failed to update status to Waiting for file_id={file_id}. Status code: {response.status_code}")
    except Exception as e:
        print(f"Error adding to print queue: {str(e)}")
    finally:
        conn.close()

def process_queue():
    while True:
        try:
            conn = sqlite3.connect(DATABASE)
            cursor = conn.cursor()
            cursor.execute("SELECT * FROM print_queue WHERE status = 'waiting'")
            rows = cursor.fetchall()
            for row in rows:
                file_id, file_path, printer_name, paper_size, orientation, copies, page_range, status = row
                if check_printer_status(printer_name):
                    print_file(file_path, printer_name, paper_size, orientation, copies, page_range)
                    cursor.execute("UPDATE print_queue SET status = 'printed' WHERE file_id = ?", (file_id,))
                    conn.commit()

                    update_url = 'http://localhost:3000/shop/update'
                    status_data = {'file_id': file_id, 'status': 'Completed'}
                    response = requests.post(update_url, json=status_data)

                    if response.status_code != 200:
                        print(f"Failed to update status to Completed for file_id={file_id}. Status code: {response.status_code}")
                else:
                    print(f"Printer '{printer_name}' is still offline. Job for file_id={file_id} remains in queue.")
            time.sleep(CHECK_INTERVAL)
        except Exception as e:
            print(f"Error processing print queue: {str(e)}")
        finally:
            conn.close()

def get_paper_size_code(paper_size):
    sizes = {
        'A3': 8,
        'A4': 9,
    }
    return sizes.get(paper_size, 9) # Default to A4

def parse_page_range(page_range):
    pages = set()
    for part in page_range.split(','):
        if '-' in part:
            start, end = map(int, part.split('-'))
            pages.update(range(start, end + 1))
        else:
            pages.add(int(part))
    return sorted(pages)

def create_print_queue_table():
    conn = sqlite3.connect(DATABASE)
    cursor = conn.cursor()
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS print_queue (
            file_id INTEGER PRIMARY KEY,
            file_path TEXT NOT NULL,
            printer_name TEXT NOT NULL,
            paper_size TEXT,
            orientation TEXT,
            copies INTEGER,
            page_range TEXT,
            status TEXT NOT NULL
        )
    """)
    conn.commit()
    conn.close()

create_print_queue_table()
queue_thread = Thread(target=process_queue)
queue_thread.start()

@app.route('/download', methods=['POST'])
def download_file():
    try:
        if 'file' not in request.files:
            return jsonify({'message': 'No file part in the request'}), 400

        file = request.files['file']
        if file.filename == '':
            return jsonify({'message': 'No selected file'}), 400

        file.save(os.path.join(UPLOAD_FOLDER, file.filename))
        filename_parts = file.filename.split('_')
        file_id = filename_parts[0].split('-')[0]

        update_url = 'http://localhost:3000/shop/update'
        status_data = {'file_id': file_id, 'status': 'Processed'}
        response = requests.post(update_url, json=status_data)

        if response.status_code != 200:
            return jsonify({'message': 'Failed to update file status on client side'}), 500

        config_url = f'http://localhost:3000/shop/fileinfo/{file_id}'
        config_response = requests.get(config_url)
        
        if config_response.status_code != 200:
            return jsonify({'message': 'Failed to retrieve print configuration'}), 500

        config_data = config_response.json()

        paper_size = config_data.get('size', 'A4')
        orientation = config_data.get('orientation', 'portrait')
        copies = config_data.get('copies', 1)
        page_range = config_data.get('pageRange', '')

        print(paper_size, orientation, copies, page_range)

        if check_printer_status(win32print.GetDefaultPrinter()):
            print_file(os.path.join(UPLOAD_FOLDER, file.filename), win32print.GetDefaultPrinter(), paper_size, orientation, copies, page_range)
        else:
            add_to_queue(file_id, os.path.join(UPLOAD_FOLDER, file.filename), win32print.GetDefaultPrinter(), paper_size, orientation, copies, page_range)
            return jsonify({'message': 'Printer is offline. Print job added to queue.'}), 200

        return jsonify({'message': 'File saved, status updated, and print job sent successfully'}), 200
    except Exception as e:
        return jsonify({'message': str(e)}), 500

if __name__ == '__main__':
    app.run(port=4000)
