const router = require("express").Router();
const clothingItem = require("./clothingItems");
const user = require("./users");
const { NotFoundError } = require("../middlewares/NotFoundError");

router.use("/items", clothingItem);
router.use("/users", user);

router.use(() => {
  throw new NotFoundError("Router not found");
});

module.exports = router;
