const router = require("express").Router();
const authMiddleware = require("../middlewares/auth");
const {
  createItem,
  getItem,
  deleteItem,
  likeItem,
  dislikeItem,
} = require("../controllers/clothingItems");
const {
  validateUserAndItemId,
  validateClothingItem,
} = require("../middlewares/validation");

router.post("/", authMiddleware, validateClothingItem, createItem);

router.get("/", getItem);

router.delete("/:itemId", authMiddleware, validateUserAndItemId, deleteItem);

router.put("/:itemId/likes", authMiddleware, validateUserAndItemId, likeItem);

router.delete(
  "/:itemId/likes",
  authMiddleware,
  validateUserAndItemId,
  dislikeItem
);

module.exports = router;
