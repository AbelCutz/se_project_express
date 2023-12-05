const router = require("express").Router();
const authMiddleware = require("../middlewares/auth");
const {
  createItem,
  getItem,
  deleteItem,
  likeItem,
  dislikeItem,
} = require("../controllers/clothingItems");

router.post("/", authMiddleware, createItem);

router.get("/", getItem);

router.delete("/:itemId", authMiddleware, deleteItem);

router.put("/:itemId/likes", authMiddleware, likeItem);

router.delete("/:itemId/likes", authMiddleware, dislikeItem);

module.exports = router;
