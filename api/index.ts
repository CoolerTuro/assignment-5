import express from "express";
import { conn } from "../dbconnect";

export const router = express.Router();

router.get("/", (req, res) => {
  res.send(
    " IMDB API  <br/>You can search movie by   route/movies/{queyParam: name}    || <br/><br/> Example <br/>      localhost:3000/movies/?name=The+avenger"
  );
});


//SearchMovie
router.get("/movies", (req, res) => {
  const { name } = req.query;
  let response: any = [];

  let sql = `SELECT * FROM movies `;
  if (name) {
    sql += `WHERE movies.title LIKE '%${name}%' `;  
  }
  sql += `ORDER BY movies.movieID`;  

  conn.query(sql, (err, movies, fields) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }

    if (movies.length === 0) {
      res.status(404).json({ error: "Movies not found" });
      return;
    }

    let count = 0;
    for (const movie of movies) {
      const movieResponse: any = { movie };

      let sqlg = `SELECT * FROM genre WHERE genre.genreID = ${movie.genreID}`;
      conn.query(sqlg, (err, genres, fields) => {
        if (err) {
          res.status(500).json({ error: err.message });
          return;
        }
        movieResponse.genre = genres;

        let sqls = `SELECT * FROM stars JOIN person ON stars.personID = person.personID WHERE stars.movieID = ${movie.movieID}`;
        conn.query(sqls, (err, stars, fields) => {
          if (err) {
            res.status(500).json({ error: err.message });
            return;
          }
          movieResponse.stars = stars;

          let sqlc = `SELECT * FROM creators JOIN person ON creators.personID = person.personID WHERE creators.movieID = ${movie.movieID}`;
          conn.query(sqlc, (err, creators, fields) => {
            if (err) {
              res.status(500).json({ error: err.message });
              return;
            }
            movieResponse.creators = creators;

            response.push(movieResponse);
            count++;

            if (count === movies.length) {
              // Send the formatted response when all movies are processed
              res.json(response);
            }
          });
        });
      });
    }
  });
});



//Movie
// Create a new movie
router.post("/movies", (req, res) => {
  const { title, year, genreID, description, rating, poster } = req.body;
  conn.query(
    "INSERT INTO movies (title, year, genreID, description, rating, poster) VALUES (?, ?, ?, ?, ?, ?)",
    [title, year, genreID, description, rating, poster],
    (err, result) => {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      res.json({ message: "Movie created successfully", id: result.insertId });
    }
  );
});

// Update  movie
router.put("/movies/:id", (req, res) => {
  const { title, year, genreID, description, rating, poster } = req.body;
  const id = req.params.id;
  conn.query(
    "UPDATE movies SET title = ?, year = ?, genreID = ?, description = ?, rating = ?, poster = ? WHERE movieID = ?",
    [title, year, genreID, description, rating, poster, id],
    (err, result) => {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      res.json({ message: "Movie updated successfully" });
    }
  );
});

// Delete a movie
router.delete("/movies/:id", (req, res) => {
  const id = req.params.id;
  conn.query("DELETE FROM movies WHERE movieID = ?", [id], (err, result) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json({ message: "Movie deleted successfully" });
  });
});

//Person
// Create a new person
router.post("/person", (req, res) => {
  const { name, age, image } = req.body;
  conn.query(
    "INSERT INTO person (name, age, image) VALUES (?, ?, ?)",
    [name, age, image],
    (err, result) => {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      res.json({ message: "Person created successfully", id: result.insertId });
    }
  );
});

// Update an existing person
router.put("/person/:id", (req, res) => {
  const { name, age, image } = req.body;
  const id = req.params.id;
  conn.query(
    "UPDATE person SET name = ?, age = ?, image = ? WHERE personID = ?",
    [name, age, image, id],
    (err, result) => {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      res.json({ message: "Person updated successfully" });
    }
  );
});

// Delete a person
router.delete("/person/:id", (req, res) => {
  const id = req.params.id;
  conn.query("DELETE FROM person WHERE personID = ?", [id], (err, result) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json({ message: "Person deleted successfully" });
  });
});

//Stars
// Create a new star for a movie
router.post("/stars", (req, res) => {
  const { movieID, personID } = req.body;
  conn.query(
    "INSERT INTO stars (movieID, personID) VALUES (?, ?)",
    [movieID, personID],
    (err, result) => {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      res.json({ message: "Star created successfully", id: result.insertId });
    }
  );
});

// Delete a star for a movie
router.delete("/stars/:id", (req, res) => {
  const id = req.params.id;
  conn.query("DELETE FROM stars WHERE starID = ?", [id], (err, result) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json({ message: "Star deleted successfully" });
  });
});

//Creator
// Create a new creator for a movie
router.post("/creators", (req, res) => {
  const { movieID, personID } = req.body;
  conn.query(
    "INSERT INTO creators (movieID, personID) VALUES (?, ?)",
    [movieID, personID],
    (err, result) => {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      res.json({
        message: "Creator created successfully",
        id: result.insertId,
      });
    }
  );
});

// Delete a creator for a movie
router.delete("/creators/:id", (req, res) => {
  const id = req.params.id;
  conn.query(
    "DELETE FROM creators WHERE creatorID = ?",
    [id],
    (err, result) => {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      res.json({ message: "Creator deleted successfully" });
    }
  );
});