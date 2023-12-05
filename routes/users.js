const router = require("express").Router();
const authMiddleware = require("../middlewares/auth");
const {
  createUser,
  getUsers,
  updateUser,
  getCurrentUser,
  getUser,
  updateProfile,
} = require("../controllers/users");

router.post("/", createUser);

router.get("/", getUsers);

router.get("/me", authMiddleware, getCurrentUser);

router.put("/:userId", authMiddleware, updateUser);

router.patch("/me", authMiddleware, updateProfile);

router.get("/:userId", authMiddleware, getUser);

module.exports = router;
