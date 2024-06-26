CREATE TABLE IF NOT EXISTS users (
	user_id INTEGER PRIMARY KEY AUTOINCREMENT,
	username TEXT NOT NULL,
	email TEXT UNIQUE,
	password TEXT NOT NULL,
	role TEXT NOT NULL, -- admin | user | client
	new BOOLEAN DEFAULT 0
);

CREATE TABLE IF NOT EXISTS shops (
	shop_id INTEGER PRIMARY KEY AUTOINCREMENT,
	shop_name TEXT NOT NULL,
	shop_location TEXT,
	secret TEXT,

	service_cost INTEGER,
	a4_bw_cost INTEGER,
	a4_color_cost INTEGER,
	a3_bw_cost INTEGER,
	a3_color_cost INTEGER,

	lat NUMBER DEFAULT NULL,
	lng NUMBER DEFAULT NULL
);

CREATE TABLE IF NOT EXISTS shop_staff (
    user_id INTEGER NOT NULL,
    shop_id INTEGER NOT NULL,
	
	status TEXT DEFAULT 'pending', -- pending | approved
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (shop_id) REFERENCES shops(shop_id) ON DELETE CASCADE
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
	status TEXT NOT NULL,
	
	FOREIGN KEY(shop_id) REFERENCES shops(shop_id),
	FOREIGN KEY(user_id) REFERENCES users(user_id)
);

CREATE TABLE IF NOT EXISTS printers (
    printer_id INTEGER PRIMARY KEY AUTOINCREMENT,
	printer_name TEXT NOT NULL,
	user_id INTEGER,
	FOREIGN KEY(user_id) REFERENCES users(user_id)
);

CREATE TABLE IF NOT EXISTS routes (
    route_id INTEGER PRIMARY KEY AUTOINCREMENT,
    shop_id INTEGER NOT NULL,
    route_link TEXT,
    FOREIGN KEY(shop_id) REFERENCES shops(shop_id)
);

INSERT INTO users (username, email, password, role) VALUES ('admin1', 'asd@gmail.com', '123456*', 'admin');
INSERT INTO users (username, email, password, role, new) VALUES ('client1', 'asd123@gmail.com', '123456*', 'client', 1);
INSERT INTO users (username, email, password, role) VALUES ('user1', 'asd1232@gmail.com', '123456*', 'user');