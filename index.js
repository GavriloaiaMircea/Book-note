import express from "express";
import bodyParser from "body-parser";
import pg from "pg";
import axios from "axios";

const app = express();
const port = 3000;

const db = new pg.Client({
  user: "postgres",
  host: "localhost",
  database: "book_notes",
  password: "pgadmin2212",
  port: 5432,
});
db.connect();

let books = [];

//Middleware
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", async (req, res) => {
  const { sortBy } = req.query;
  let orderBy = "read_date";
  let order = "DESC";

  if (sortBy === "rating") {
    orderBy = "rating";
    order = "DESC";
  } else if (sortBy === "author") {
    orderBy = "author";
    order = "ASC";
  } else if (sortBy === "title") {
    orderBy = "title";
    order = "ASC";
  }

  try {
    const result = await db.query(
      `SELECT * FROM books ORDER BY ${orderBy} ${order}`
    );
    const books = result.rows;
    res.render("index.ejs", { books });
  } catch (error) {
    console.error("Eroare la sortare:", error);
    res.status(500).send("Eroare la sortare");
  }
});

app.get("/add", (req, res) => {
  res.render("add.ejs");
});

app.post("/add", async (req, res) => {
  const { title, author, rating, read_date, review } = req.body;

  let isbn = null;

  try {
    // Căutare ISBN folosind Open Library API
    const response = await axios.get(
      `https://openlibrary.org/search.json?title=${title}&author=${author}`
    );
    if (response.data.docs && response.data.docs.length > 0) {
      const bookData = response.data.docs[0];
      isbn = bookData.isbn ? bookData.isbn[0] : null; // Obținem primul ISBN

      // Dacă există ISBN, generăm URL-ul copertei
      if (isbn) {
        coverUrl = `https://covers.openlibrary.org/b/isbn/${isbn}-L.jpg`;
      }
    }

    // Inserăm datele în baza de date
    await db.query(
      "INSERT INTO books (title, author, rating, review, read_date, isbn, cover_url) VALUES ($1, $2, $3, $4, $5, $6, $7)",
      [title, author, rating, review, read_date, isbn, coverUrl]
    );
    res.redirect("/");
  } catch (err) {
    console.error("Eroare la adăugarea cărții:", err);
    res.status(500).send("Eroare la adăugarea cărții.");
  }
});

app.post("/delete/:id", async (req, res) => {
  const id = req.params.id;
  try {
    await db.query("DELETE FROM books WHERE id = $1", [id]);
    res.redirect("/");
  } catch (error) {
    console.log(error);
  }
});

app.get("/edit/:id", async (req, res) => {
  const id = req.params.id;
  try {
    const result = await db.query("SELECT * FROM books WHERE id = $1", [id]);
    const book = result.rows[0];
    res.render("edit.ejs", { book: book });
  } catch (error) {
    console.log(error);
  }
});

app.post("/edit/:id", async (req, res) => {
  const id = req.params.id;
  const { title, author, rating, read_date, review } = req.body;
  let isbn = null;
  let coverUrl = null;

  try {
    // Căutare ISBN folosind Open Library API
    const response = await axios.get(
      `https://openlibrary.org/search.json?title=${title}&author=${author}`
    );
    if (response.data.docs && response.data.docs.length > 0) {
      const bookData = response.data.docs[0];
      isbn = bookData.isbn ? bookData.isbn[0] : null; // Obținem primul ISBN

      // Dacă există ISBN, generăm URL-ul copertei
      if (isbn) {
        coverUrl = `https://covers.openlibrary.org/b/isbn/${isbn}-L.jpg`;
      }
    }

    // Inserăm datele în baza de date
    await db.query(
      "UPDATE books SET title = $1, author = $2, rating = $3, review = $4, read_date = $5, isbn = $6, cover_url = $7 WHERE id = $8",
      [title, author, rating, review, read_date, isbn, coverUrl, id]
    );
    res.redirect("/");
  } catch (err) {
    console.error("Eroare la editarea cărții:", err);
    res.status(500).send("Eroare la editarea cărții.");
  }
});

app.listen(port, () => {
  console.log("Server Running on Port 3000");
});
