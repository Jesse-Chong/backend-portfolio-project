// DEPENDENCIES
const express = require("express");
const app = express();
const cors = require("cors");

// MIDDLEWARE
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Time to get priorities straight!");
});

app.get("*", (req, res) => {
  res.status(404).send("Page Not Found");
});

module.exports = app;
