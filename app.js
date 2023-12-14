const { PORT = 3001 } = process.env;

const mongoose = require("mongoose");
const express = require("express");
const cors = require("cors");

const app = express();

mongoose.connect("mongodb://127.0.0.1:27017/wtwr_db");

app.use((req, res, next) => {
  req.user = {
    _id: "",
  };
  next();
});

app.use(express.json());
app.use(cors());

const routes = require("./routes");

app.use(routes);

app.listen(PORT, () => {
  console.log(`App listening at port ${PORT}`);
  console.log("This is working");
});
