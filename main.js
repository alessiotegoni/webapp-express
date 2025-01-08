import express from "express";
import dotenv from "dotenv";
import movieRouter from "./routes/movieRouter.js";
import { notFound, errorHandler } from "./middlewares/errorHandler.js";

dotenv.config();

const app = express();
app.use(express.json());

app.use("/movies", movieRouter);

app.use([notFound, errorHandler]);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
