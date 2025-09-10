import mysql from "mysql2/promise";
import dotenv from "dotenv";

dotenv.config(); // load .env file

const db = mysql.createPool({
    host : process.env.DB_HOST,
    user: process.env.DB_USER,
    password : process.env.DB_PASSWORD ,
    database : process.env.DB_NAME,
    connectionLimit : 10,
});

// Check if connection works
(async () => {
  try {
    const connection = await db.getConnection();
    console.log("Database connected successfully!");
    connection.release(); // release back to pool
  } catch (err) {
    console.error("Database connection failed:", err.message);
  }
})();

export default db;
