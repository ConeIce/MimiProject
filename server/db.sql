CREATE TABLE IF NOT EXISTS users (
	user_id INTEGER PRIMARY KEY AUTOINCREMENT,
	username TEXT NOT NULL,
	email TEXT NOT NULL,
	password TEXT NOT NULL,
	role TEXT NOT NULL -- admin | default
);

CREATE TABLE IF NOT EXISTS shops (
	shop_id INTEGER PRIMARY KEY AUTOINCREMENT,
	owner_id INTEGER,
	shop_name TEXT,
	FOREIGN KEY(owner_id) REFERENCES users(id)
);

CREATE TABLE IF NOT EXISTS files (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    shop TEXT, -- we need to remove this and use shop_id. Need to make related changes in both server and frontend
	user_id INTEGER, -- ID of user who submitted the print, should be retrieved from passport ig
	shop_id INTEGER,
    size TEXT,
    orientation TEXT,
    pages INTEGER,
    copies INTEGER,
    filename TEXT,
    file BLOB,
	done BOOLEAN DEFAULT 0,
	FOREIGN KEY(shop_id) REFERENCES shops(shop_id),
	FOREIGN KEY(user_id) REFERENCES users(user_id)
);

CREATE TABLE IF NOT EXISTS printers (
    printer_id INTEGER PRIMARY KEY AUTOINCREMENT,
	printer_name TEXT,
	owner_id INTEGER,
	FOREIGN KEY(owner_id) REFERENCES users(id)
)