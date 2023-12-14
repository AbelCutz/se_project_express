const router = require("express").Router();
const authMiddleware = require("../middlewares/auth");
const { getCurrentUser, updateProfile } = require("../controllers/users");

router.get("/me", authMiddleware, getCurrentUser);

router.patch("/me", authMiddleware, updateProfile);

module.exports = router;
