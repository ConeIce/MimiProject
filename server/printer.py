from flask import Flask, send_file, request, jsonify
import os
import requests
import win32print
import win32api

app = Flask(__name__)

UPLOAD_FOLDER = 'shop_upload' 

def print_file(file_path, paper_size, orientation, copies, page_range):
    try:
        print(file_path)
        printer_name = win32print.GetDefaultPrinter()
        print(printer_name)

        hprinter = win32print.OpenPrinter(printer_name)
        print('ehy')
        try:
            printer_info = win32print.GetPrinter(hprinter, 2)
            print('ehy2')
            devmode = printer_info["pDevMode"]
            print('ehy3')
            devmode.PaperSize = get_paper_size_code(paper_size)
            devmode.Orientation = 1 if orientation == 'portrait' else 2  # 1 = Portrait, 2 = Landscape
            devmode.Copies = copies

            win32api.ShellExecute(
                0,
                "print",
                file_path,
                None,
                ".",
                0
            )
        finally:
            win32print.ClosePrinter(hprinter)
    except Exception as e:
        print(e)

def get_paper_size_code(paper_size):
    sizes = {
        'A3': 8,  
        'A4': 9,  
    }
    return sizes.get(paper_size, 9)  # Default to A4

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

        print_file(os.path.join(UPLOAD_FOLDER, file.filename), paper_size, orientation, copies, page_range)
        return jsonify({'message': 'File saved, status updated, and print job sent successfully'}), 200
    except Exception as e:
        return jsonify({'message': str(e)}), 500

if __name__ == '__main__':
    app.run(port=4000)
