import { configDotenv } from "dotenv";
import mysql from "mysql2/promise";

configDotenv();

const db = await mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

export const connectDB = async () => {
  try {
    await db.connect();
    console.log("✅ Database connected succesfully");
  } catch (err) {
    console.error(err);
  }
};
export default db;
