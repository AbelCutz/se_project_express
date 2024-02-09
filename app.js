require("dotenv").config();

const { PORT = 3001 } = process.env;
const mongoose = require("mongoose");
const express = require("express");
const cors = require("cors");
const { errors } = require("celebrate");
const routes = require("./routes");
const { requestLogger, errorLogger } = require("./middlewares/logger");
const { handleServerError } = require("./middlewares/errorHandler");
const { login, createUser } = require("./controllers/users");
const {
  validateLoginUser,
  validateUserInfo,
} = require("./middlewares/validation");

const app = express();

mongoose.connect("mongodb://127.0.0.1:27017/wtwr_db");

app.use(express.json());
app.use(cors());

app.get("/crash-test", () => {
  setTimeout(() => {
    throw new Error("Server will crash now");
  }, 0);
});

app.use(requestLogger);

app.post("/signin", validateLoginUser, login);
app.post("/signup", validateUserInfo, createUser);

app.use(routes);
app.use(errorLogger);
app.use(errors());
app.use(handleServerError);

app.listen(PORT, () => {
  console.log(`App listening at port ${PORT}`);
  console.log("This is working");
});
