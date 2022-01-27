const express = require("express");
const cors = require("cors");
const path = require("path");
const routes = require("./routes");
const app = express();

app.use(cors());

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.use((req, res, next) => {
  console.log(`${req.method}: ${req.url}`);
  next();
});

app.use(express.json());

app.use(express.static(path.join(__dirname, "../build")));
app.use(routes);
app.use((req, res, next) => {
  console.log("Unhandled request URL:", req.url);
  next();
});

module.exports = { app };