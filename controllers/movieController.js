import asyncHandler from "express-async-handler";
import db from "../db/conn.js";
import { getImageUrl } from "../lib/utils.js";

export const getAllMovies = asyncHandler(async (req, res) => {
  const { search } = req.query;

  let sql = "SELECT * FROM movies";

  if (search)
    sql += ` WHERE title LIKE %${search}% OR abstract LIKE %${search}%`;

  const [results] = await db.query(sql);

  let movies = results.map(async (movie) => {
    const [[{ avgVote }]] = await db.query(
      "SELECT ROUND(AVG(vote), 2) AS avgVote FROM reviews WHERE movie_id = ?",
      [movie.id]
    );

    return {
      ...movie,
      image: getImageUrl(movie.image),
      avgVote,
    };
  });

  movies = await Promise.all(movies);

  res.status(200).json(movies);
});

export const getMovieById = asyncHandler(async (req, res) => {
  const { id: movieId } = req.params;

  if (!movieId) throw new Error("movieId required");

  const movieQuery = db.query("SELECT * FROM movies WHERE id = ?", [movieId]);
  const reviewsQuery = db.query("SELECT * FROM reviews WHERE movie_id = ?", [
    movieId,
  ]);
  const avgVoteQuery = db.query(
    "SELECT AVG(vote) AS avgVote FROM reviews WHERE movie_id = ?",
    [movieId]
  );

  const [[[movie]], [reviews], [[{ avgVote }]]] = await Promise.all([
    movieQuery,
    reviewsQuery,
    avgVoteQuery,
  ]);

  if (!movie) {
    res.status(404);
    throw new Error("Movie not found");
  }
  res
    .status(200)
    .json({ ...movie, image: getImageUrl(movie.image), reviews, avgVote });
});

export const createReview = asyncHandler(async (req, res) => {
  const { id: movieId } = req.params;
  const { name, text, vote } = req.body;

  if (!movieId || !name || !text || !vote || isNaN(vote))
    throw new Error("All fields are required");

  const [[movie]] = await db.query("SELECT id FROM movies WHERE id = ?", [
    movieId,
  ]);

  if (!movie?.id) throw new Error("Movie not found");

  const [result] = await db.query(
    `INSERT INTO reviews (movie_id, name, vote, text)
    VALUES (?, ?, ?, ?)`,
    [movie.id, name, vote, text]
  );

  if (!result.affectedRows) throw new Error("Error creating the review");

  res
    .status(201)
    .json({ message: "Review created!", insertId: result.insertId });
});
