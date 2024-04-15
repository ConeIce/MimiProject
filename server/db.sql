CREATE TABLE IF NOT EXISTS users (
	user_id INTEGER PRIMARY KEY AUTOINCREMENT,
	username TEXT NOT NULL,
	email TEXT UNIQUE,
	password TEXT NOT NULL,
	role TEXT NOT NULL, -- admin | user
	new BOOLEAN DEFAULT 1
);

CREATE TABLE IF NOT EXISTS shops (
	shop_id INTEGER PRIMARY KEY AUTOINCREMENT,
	user_id INTEGER,
	shop_name TEXT UNIQUE,
	FOREIGN KEY(user_id) REFERENCES users(user_id)
);

CREATE TABLE IF NOT EXISTS files (
    file_id INTEGER PRIMARY KEY AUTOINCREMENT,
	user_id INTEGER NOT NULL,
	shop_id INTEGER NOT NULL,

    size TEXT NOT NULL, -- A3, A4 ...
    orientation TEXT NOT NULL,
    totalPages INTEGER,
	pageRange TEXT NOT NULL, 
    copies INTEGER NOT NULL,
    filename TEXT NOT NULL,
	done BOOLEAN DEFAULT 0,
	
	FOREIGN KEY(shop_id) REFERENCES shops(shop_id),
	FOREIGN KEY(user_id) REFERENCES users(user_id)
);

CREATE TABLE IF NOT EXISTS printers (
    printer_id INTEGER PRIMARY KEY AUTOINCREMENT,
	printer_name TEXT NOT NULL,
	user_id INTEGER,
	FOREIGN KEY(user_id) REFERENCES users(user_id)
);
	

SELECT file_id, filename, shop_name from files
JOIN shops ON files.shop_id = shops.shop_id
WHERE files.user_id = 3;