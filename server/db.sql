CREATE TABLE IF NOT EXISTS users (
	user_id INTEGER PRIMARY KEY AUTOINCREMENT,
	username TEXT NOT NULL,
	email TEXT,
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

    size TEXT NOT NULL, -- A3, A4 ...
    orientation TEXT NOT NULL,
    totalPages INTEGER,
	pageRange TEXT NOT NULL, 
    copies INTEGER NOT NULL,
    filename TEXT NOT NULL,
    file BLOB,
	done BOOLEAN DEFAULT 0,
	
	FOREIGN KEY(shop_id) REFERENCES shops(shop_id),
	FOREIGN KEY(user_id) REFERENCES users(user_id)
);

CREATE TABLE IF NOT EXISTS printers (
    printer_id INTEGER PRIMARY KEY AUTOINCREMENT,
	printer_name TEXT NOT NULL,
	owner_id INTEGER,
	FOREIGN KEY(owner_id) REFERENCES users(id)
);

-- Inserting users
INSERT INTO users (username, password, role) VALUES ('adminUser', 'adminPass', 'admin');
INSERT INTO users (username, password, role) VALUES ('defaultUser', 'defaultPass', 'default');
INSERT INTO users (username, password, role) VALUES ('adminUser2', 'adminPass2', 'admin');
INSERT INTO users (username, password, role) VALUES ('defaultUser2', 'defaultPass2', 'default');

-- Inserting shops
INSERT INTO shops (owner_id, shop_name) VALUES (1, 'Shop1');
INSERT INTO shops (owner_id, shop_name) VALUES (1, 'Shop2');
INSERT INTO shops (owner_id, shop_name) VALUES (1, 'Shop3');
INSERT INTO shops (owner_id, shop_name) VALUES (2, 'Shop4');

-- Inserting files
INSERT INTO files (shop, user_id, shop_id, size, orientation, totalPages, pageRange, copies, filename, done) 
VALUES ('Shop1', 1, 1, 'A4', 'portrait', 10, '1-10', 2, 'file1.pdf', 0);
INSERT INTO files (shop, user_id, shop_id, size, orientation, totalPages, pageRange, copies, filename, done) 
VALUES ('Shop1', 2, 2, 'A3', 'landscape', 20, '1-20', 3, 'file2.pdf', 0);
INSERT INTO files (shop, user_id, shop_id, size, orientation, totalPages, pageRange, copies, filename, done) 
VALUES ('Shop1', 2, 2, 'A4', 'portrait', 15, '1-15', 1, 'file3.pdf', 0);

INSERT INTO printers (printer_name, owner_id) VALUES ('Printer1', 1);
INSERT INTO printers (printer_name, owner_id) VALUES ('Printer2', 2);