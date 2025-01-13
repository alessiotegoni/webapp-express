import express from 'express';
import * as movieController from "../controllers/movieController.js";

const router = express.Router();

router.get('/', movieController.getAllMovies);
router.get('/:id', movieController.getMovieById);

router.post('/:id/reviews', movieController.createReview);

export default router;
