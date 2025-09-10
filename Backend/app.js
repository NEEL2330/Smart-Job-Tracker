import express from "express";
import jobRoutes from "./src/routes/jobs.js";

const app = express();

app.use(express.json());

// Routes
app.use("/api/jobs", jobRoutes);

app.listen(5000, () => {
  console.log("Server running on port 5000");
});
