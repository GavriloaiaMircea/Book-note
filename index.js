import express from "express";
import bodyParser from "body-parser";
import pg from "pg";

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

app.listen(port, () => {
  console.log("Server Running on Port 3000");
});
