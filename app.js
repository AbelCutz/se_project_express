const { PORT = 3001 } = process.env;

const mongoose = require("mongoose");
const express = require("express");
const cors = require("cors");
const { errors } = require("celebrate");
const routes = require("./routes");
const { requestLogger, errorLogger } = require("./middlewares/logger");
const { handleServerError } = require("./middlewares/errorHandler");

const app = express();

mongoose.connect("mongodb://127.0.0.1:27017/wtwr_db");

app.use(express.json());
app.use(cors());

app.use(requestLogger);
app.use(routes);
app.use(errorLogger);
app.use(errors);
app.use(handleServerError);

app.listen(PORT, () => {
  console.log(`App listening at port ${PORT}`);
  console.log("This is working");
});
