const express = require("express");
const db = require("./config/db");

const app = express();
app.use(express.json());

module.exports = app;
