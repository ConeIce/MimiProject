## How to initially setup SQLite

--> Download Link
https://www.sqlite.org/2024/sqlite-tools-win-x64-3450200.zip

Un-Zip. SQLite.exe runs the command line tool
(Try to put it in program files and adding to path to make it globally accessible. But don't waste time on this)

Now to setup the database

0. Delete database.db if already exists
1. Open the Sqlite3 Shell
2. .open <path-to-database.db> <!-- Name of db should be database.db -->
3. .read <path-to-db.sql> <!-- SQL File is in the server folder -->

Should be set to use.
