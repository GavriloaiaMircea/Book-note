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
  try {
    const result = await db.query("SELECT * FROM books");
    books = result.rows;
    res.render("index.ejs", { books: books });
  } catch (error) {
    console.log(error);
  }
});

app.get("/add", (req, res) => {
  res.render("add.ejs");
});

app.post("/add", async (req, res) => {
  const { title, author, rating, read_date, review } = req.body;

  let isbn = null;
  let coverUrl = "/images/placeholder.jpg"; // Placeholder-ul implicit

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

app.listen(port, () => {
  console.log("Server Running on Port 3000");
});
