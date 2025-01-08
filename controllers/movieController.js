import asyncHandler from "express-async-handler";
import db from "../db/conn.js";

export const getAllMovies = asyncHandler(async (req, res) => {
  const query = "SELECT * FROM movies";
  const [results] = await db.query(query);
  res.status(200).json(results);
});

export const getMovieById = asyncHandler(async (req, res) => {
  const { id: movieId } = req.params;

  if (!movieId) throw new Error("movieId required");

  const query = `
    SELECT m.*,
    JSON_ARRAYAGG(
        JSON_OBJECT(
            'id', r.id,
            'name', r.name,
            'vote', r.vote,
            'text', r.text,
            'created_at', r.created_at,
            'updated_at', r.updated_at
        )
    ) AS reviews
    FROM movies AS m
    LEFT JOIN reviews AS r ON m.id = r.movie_id
    WHERE m.id = ?
    GROUP BY m.id;

  `;
  const [results] = await db.query(query, [movieId]);
  if (!results.length) {
    res.status(404);
    throw new Error("Movie not found");
  }
  res.status(200).json(results);
});
