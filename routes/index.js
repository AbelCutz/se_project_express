const router = require("express").Router();
const clothingItem = require("./clothingItems");
const user = require("./users");
const { ERROR_500 } = require("../utils/errors");

router.use("/items", clothingItem);
router.use("/users", user);

router.use((req, res) => {
  res.status(ERROR_500).send({ message: "Router not found" });
});

module.exports = router;
