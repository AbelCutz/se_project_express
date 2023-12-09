const ClothingItem = require("../models/clothingItem");
const {
  ERROR_400,
  ERROR_403,
  ERROR_404,
  ERROR_500,
} = require("../utils/errors");

const getItem = (req, res) => {
  ClothingItem.find({})
    .then((items) => res.send({ items }))
    .catch((error) => {
      console.error(error);
      res.status(ERROR_500).send({ message: "Error from getItems" });
    });
};
const createItem = async (req, res) => {
  console.log(req);
  console.log(req.body);
  console.log(req._id);
  try {
    const { name, weather, imageUrl, likes } = req.body;
    const item = await ClothingItem.create({
      name,
      weather,
      imageUrl,
      likes,
      owner: req.user._id,
    });
    return res.status(201).send({ data: item });
  } catch (error) {
    console.error(error);
    if (error.name === "ValidationError") {
      return res.status(ERROR_400).json({ message: error.message });
    }
    return res.status(ERROR_500).json({ error: "Internal Server Error" });
  }
};

const deleteItem = async (req, res) => {
  try {
    const { itemId } = req.params;
    const userId = req.user._id;

    const item = await ClothingItem.findById(itemId);

    if (!item) {
      return res.status(ERROR_404).json({ message: "Clothing item not found" });
    }

    if (item.owner.toString() !== userId.toString()) {
      return res
        .status(ERROR_403)
        .json({ message: "You do not have permission to delete this item" });
    }
    await item.remove();
    return res.status(200).json({ itemId });
  } catch (error) {
    console.error();
    if (error.name === "CastError") {
      return res
        .status(ERROR_400)
        .json({ message: "Invalid ID in deleteItem" });
    }
    return res.status(ERROR_500).send({ message: "Error from deleteItems" });
  }
};

const likeItem = async (req, res) => {
  try {
    const userId = req.user._id;
    const item = await ClothingItem.findByIdAndUpdate(
      req.params.itemId,
      { $addToSet: { likes: userId } },
      { new: true }
    );
    if (!item) {
      return res.status(ERROR_404).send({ message: "Clothing item not found" });
    }
    return res.status(200).send({ data: item });
  } catch (error) {
    console.error(error);
    if (error.name === "CastError") {
      return res.status(ERROR_400).json({ message: "Invalid request" });
    }
    return res.status(ERROR_500).json({ message: "Error from likeItem" });
  }
};

const dislikeItem = async (req, res) => {
  ClothingItem.findByIdAndUpdate(
    req.params.itemId,
    { $pull: { likes: req.user._id } },
    { new: true }
  )
    .then((item) => {
      if (!item) {
        return res
          .status(ERROR_404)
          .json({ message: "Clothing item not found" });
      }
      return res.status(200).send({ data: item });
    })
    .catch((error) => {
      console.error(error);
      if (error.name === "CastError") {
        return res
          .status(ERROR_400)
          .json({ message: "Invalid ID in dislikeItem" });
      }
      return res.status(ERROR_500).send({ message: "Error from dislikeItem" });
    });
};
module.exports = {
  createItem,
  getItem,
  deleteItem,
  likeItem,
  dislikeItem,
};
