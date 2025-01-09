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

  const movieQuery = db.query("SELECT * FROM movies WHERE id = ?", [movieId]);
  const reviewsQuery = db.query("SELECT * FROM reviews WHERE movie_id = ?", [
    movieId,
  ]);

  const [[[movie]], [reviews]] = await Promise.all([movieQuery, reviewsQuery]);

  if (!movie) {
    res.status(404);
    throw new Error("Movie not found");
  }
  res.status(200).json({ ...movie, reviews });
});
