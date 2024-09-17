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

INSERT INTO books (title, author, rating, review, read_date, isbn, cover_url)
VALUES 
  ('Atomic Habits', 'James Clear', 9, 'Fantastic book on habit-building.', '2023-08-01', '9780735211292', 'https://covers.openlibrary.org/b/isbn/9780735211292-L.jpg'),
  ('Sapiens', 'Yuval Noah Harari', 10, 'A mind-blowing journey through human history.', '2023-07-15', '9780062316097', 'https://covers.openlibrary.org/b/isbn/9780062316097-L.jpg'),
  ('The Power of Now', 'Eckhart Tolle', 8, 'A deep dive into spiritual presence.', '2023-09-10', '9781577314806', 'https://covers.openlibrary.org/b/isbn/9781577314806-L.jpg');