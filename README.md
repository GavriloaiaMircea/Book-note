# Book Notes Project

This is a web application for tracking the books you've read. Inspired by Derek Sivers' book notes, this project allows you to add, update, and delete books, sort them by rating, title, or author, and filter by rating. It also fetches book cover images automatically using the Open Library API.

## Features
- Add new books with a title, author, rating, and review.
- Automatically fetch book cover images and ISBN from the Open Library API.
- Update or delete existing books.
- Sort books by rating, title, author, or read date.
- Filter books by minimum rating.

## Project Setup

### 1. Clone the repository

To clone this project to your local machine, run the following command:

```bash
git clone https://github.com/GavriloaiaMircea/Book-note.git
```

### 2. Install dependencies
Navigate to the project directory and install the required Node.js dependencies:

```bash
cd Book-note
npm install
```

### 3. Set up PostgreSQL
Ensure that PostgreSQL is installed and running on your machine. Create a database named `book_notes` and set up the required table:

```sql
CREATE DATABASE book_notes;

CREATE TABLE books (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  author VARCHAR(255) NOT NULL,
  rating INTEGER CHECK (rating >= 1 AND rating <= 10),
  review TEXT,
  read_date DATE NOT NULL,
  isbn VARCHAR(13),
  cover_url TEXT
);
```

### 4. Configure the database connection
In the `index.js` file, make sure to configure the PostgreSQL client with your correct username, password, and other connection details:

```javascript
const db = new pg.Client({
  user: "your_username",
  host: "localhost",
  database: "book_notes",
  password: "your_password",
  port: 5432,
});
```

### 5. Run the server
You can start the server using either `node` or `nodemon`:

```bash
node index.js
```

or if you prefer using `nodemon` for automatic reloads during development:

```bash
nodemon index.js
```

The server should now be running at `http://localhost:3000`.

## Usage
1. Navigate to `http://localhost:3000` in your browser.
2. You can add new books by clicking the "New Book" button.
3. Sort or filter books by using the sort and filter options provided on the page.
4. Edit or delete books by clicking the respective buttons next to each book entry.

## Technologies Used
* Node.js with Express
* PostgreSQL for database persistence
* EJS for templating
* Open Library API for fetching book covers and ISBNs
* Axios for making HTTP requests
