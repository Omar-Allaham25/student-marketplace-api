const express = require("express");
const db = require("./config/db");
const authrouter = require("./routes/authRoutes");

const app = express();
app.use(express.json());

app.use("/api/auth", authrouter);

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "Something went wrong!" });
});

module.exports = app;
