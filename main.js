import express from "express";
import { configDotenv } from "dotenv";
import movieRouter from "./routes/movieRouter.js";
import { notFound, errorHandler } from "./middlewares/errorHandler.js";
import { connectDB } from "./db/conn.js";
import cors from "cors"

configDotenv()
const app = express();

app.use(cors(process.env.CLIENT_URL))
app.use(express.json());
app.use(express.static("public"))

app.use("/movies", movieRouter);

app.use([notFound, errorHandler]);

const PORT = process.env.PORT || 3000;

connectDB().then(() =>
  app.listen(PORT, () => {
    console.log(`✅ Server running on http://localhost:${PORT}`);
  })
);
