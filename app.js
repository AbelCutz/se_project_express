const { PORT = 3001 } = process.env;

const mongoose = require("mongoose");
const express = require("express");

const app = express();

mongoose.connect("mongodb://127.0.0.1:27017/wtwr_db");

app.use((req, res, next) => {
  req.user = {
    _id: "",
  };
  next();
});

app.use(express.json());

const routes = require("./routes");

app.use(routes);

app.listen(PORT, () => {});
