import express from "express";
import cors from "cors";
import "dotenv/config";
import pool from "./config/db.js";
import userRouter from "./routes/userroute.js";

const app = express();
app.use(express.json());
app.use(cors());
app.use("/api/users", userRouter);

const port = process.env.PORT || 4000;

app.get("/api/users", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM users ORDER BY id ASC");
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Database error" });
  }
});

app.get("/", (req, res) => {
  res.send("api working");
});
app.use("/api/user", userRouter);

app.listen(port, () => {
  console.log(`server started on http://localhost:${port}`);
});
``