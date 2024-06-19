import sys
import time
import logging
import queue
import threading
import sqlite3
import requests
from watchdog.observers import Observer
from watchdog.events import FileSystemEventHandler
import os

class FileQueueHandler(FileSystemEventHandler):
    def __init__(self, file_queue):
        super().__init__()
        self.file_queue = file_queue
        self.db_connection = sqlite3.connect('database.db') 

    def on_created(self, event):
        if not event.is_directory:
            self.file_queue.put(event.src_path)

def process_files(file_queue):
    db_connection = sqlite3.connect('database.db')  
    while True:
        file_path = file_queue.get()
        logging.info(f"Processing file: {file_path}")

        shop_id = extract_shop_id(file_path)

        route_link = get_route_link_from_database(db_connection, shop_id)
        print(route_link)

        send_request_to_shop(route_link, file_path)

        time.sleep(1)
        file_queue.task_done()

    db_connection.close()

def extract_shop_id(file_path):
    filename = os.path.basename(file_path)
    
    parts = filename.split("-")
    if len(parts) < 2:
        return None
    
    shop_id_part = parts[1]
    
    shop_id = shop_id_part.split("_")[0]
    
    return shop_id

def get_route_link_from_database(db_connection, shop_id):
    try:
        cursor = db_connection.cursor()
        cursor.execute("SELECT route_link FROM routes WHERE shop_id = ?", (shop_id,))
        result = cursor.fetchone()
        if result:
            return result[0]
    except sqlite3.Error as e:
        logging.error(f"Error retrieving route link from database: {e}")
    return None

def send_request_to_shop(route_link, file_path):
    print(route_link, file_path)
    if route_link:
        try:
            with open(file_path, 'rb') as file:
                files = {'file': file}
                response = requests.post(f'http://{route_link}/download', files=files)
                if response.status_code == 200:
                    logging.info(f"File sent successfully to {route_link}")
                else:
                    logging.error(f"Failed to send file to {route_link}. Status code: {response.status_code}")
        except FileNotFoundError:
            logging.error(f"File not found: {file_path}")
        except Exception as e:
            logging.error(f"Error sending file to {route_link}: {e}")


if __name__ == "__main__":
    logging.basicConfig(level=logging.INFO,
                        format='%(asctime)s - %(message)s',
                        datefmt='%Y-%m-%d %H:%M:%S')
    path = 'C:\\Dev\\MimiProject\\server\\uploads_final'
    logging.info(f"Start watching directory: {path}")

    file_queue = queue.Queue()

    file_processor_thread = threading.Thread(target=process_files, args=(file_queue,))
    file_processor_thread.daemon = True
    file_processor_thread.start()

    event_handler = FileQueueHandler(file_queue)
    observer = Observer()
    observer.schedule(event_handler, path, recursive=True)
    observer.start()

    try:
        while True:
            time.sleep(1)
    except KeyboardInterrupt:
        observer.stop()
        observer.join()

    file_queue.join()
