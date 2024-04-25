import sys
import time
import logging
import queue
import threading
import sqlite3
import requests
from watchdog.observers import Observer
from watchdog.events import FileSystemEventHandler

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

        # shop_id = extract_shop_id(file_path)
        shop_id = 1

        route_link = get_route_link_from_database(db_connection, shop_id)

        send_request_to_shop(route_link, file_path)

        time.sleep(1)
        file_queue.task_done()

    db_connection.close()

def extract_shop_id(file_path):
    pass

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
    if route_link:
        print(route_link)

if __name__ == "__main__":
    logging.basicConfig(level=logging.INFO,
                        format='%(asctime)s - %(message)s',
                        datefmt='%Y-%m-%d %H:%M:%S')
    path = 'C:\\Dev\\MimiProject\\server\\uploads'
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
