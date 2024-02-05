const router = require("express").Router();
const authMiddleware = require("../middlewares/auth");
const { getCurrentUser, updateProfile } = require("../controllers/users");
const { validateUserUpdate } = require("../middlewares/validation");

router.get("/me", authMiddleware, getCurrentUser);

router.patch("/me", authMiddleware, validateUserUpdate, updateProfile);

module.exports = router;
