Express + MySQL Notes App
=========================

This is a minimal **Express.js** application with a simple web UI that stores text entries in a **MySQL** database.

The application:

-   Automatically creates the database and table on startup

-   Provides a UI with a text area and a button

-   Saves submitted text into MySQL

-   Reloads the page and displays all stored records

Only MySQL credentials are required.

* * * * *

Requirements
------------

-   Node.js 18+

-   MySQL 8+ (local or remote)

* * * * *

Setup
-----

### 1\. Install dependencies

```
npm install
```

* * * * *

### 2\. Configure environment variables

Create a `.env` file in the project root:

```
MYSQL_HOST=127.0.0.1
MYSQL_PORT=3306
MYSQL_USER=root
MYSQL_PASSWORD=your_password_here
MYSQL_DB=express_notes
PORT=3000
```

> The database and table will be created automatically.

* * * * *

Running the application
-----------------------

```
npm start
```

The server will start on:

```
http://localhost:3000
```

* * * * *

Usage
-----

1.  Open the application in your browser

2.  Type text into the text area

3.  Click **"Save to MySQL"**

4.  The page reloads and shows all saved records

Each record includes:

-   An auto-incremented ID

-   The stored text

-   Creation timestamp
