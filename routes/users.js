const router = require("express").Router();

const {
  createUser,
  getUsers,
  updateUser,
  getUser,
} = require("../controllers/users");

router.post("/", createUser);

router.get("/", getUsers);

router.put("/:userId", updateUser);

router.get("/:userId", getUser);

module.exports = router;
