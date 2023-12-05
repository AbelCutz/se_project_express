const router = require("express").Router();
const clothingItem = require("./clothingItems");
const user = require("./users");
const { ERROR_404 } = require("../utils/errors");
const { login, createUser } = require("../controllers/users");

router.use("/items", clothingItem);
router.use("/users", user);
router.post("/signin", login);
router.post("/signup", createUser);

router.use((req, res) => {
  res.status(ERROR_404).send({ message: "Router not found" });
});

module.exports = router;
