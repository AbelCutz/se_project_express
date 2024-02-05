const router = require("express").Router();
const clothingItem = require("./clothingItems");
const user = require("./users");
const { login, createUser } = require("../controllers/users");
const { NotFoundError } = require("../middlewares/NotFoundError");

router.use("/items", clothingItem);
router.use("/users", user);
router.post("/signin", login);
router.post("/signup", createUser);

router.use(() => {
  throw new NotFoundError("Router not found");
});

module.exports = router;
