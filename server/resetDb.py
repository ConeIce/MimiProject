import os

if os.path.exists('./database.db'):
    os.remove('./database.db')

if os.path.exists('./sessions.db'):
    os.remove('./sessions.db')

os.system('sqlite3 database.db ".read db.sql"')