const ClothingItem = require("../models/clothingItem");
const { ERROR_400, ERROR_404, ERROR_500 } = require("../utils/errors");

const getItem = (req, res) => {
  ClothingItem.find({})
    .then((items) => res.send({ items }))
    .catch((error) => {
      console.error(error);
      if (error.name === "CastError") {
        return res
          .status(ERROR_400)
          .json({ message: "Invalid ID in getitems" });
      }
      es.status(ERROR_500).send({ message: "Error from getItems" });
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
      owner: req._id,
    });
    res.status(201).send({ data: item });
  } catch (error) {
    console.error(error);
    if (error.name === "ValidationError") {
      return res.status(ERROR_400).json({ message: error.message });
    } else {
      return res.status(ERROR_500).json({ error: "Internal Server Error" });
    }
  }
};

const deleteItem = (req, res) => {
  const { itemId } = req.params;
  ClothingItem.findByIdAndDelete(itemId)
    .then((item) => {
      if (!item) {
        return res
          .status(ERROR_404)
          .json({ message: "Clothing item not found" });
      }
      res.status(200).json({ message: "The item deleted", data: item });
    })
    .catch((error) => {
      console.error();
      if (error.name === "CastError") {
        return res
          .status(ERROR_400)
          .json({ message: "Invalid ID in deleteItem" });
      }
      res.status(ERROR_500).send({ message: "Error from deleteItems" });
    });
};

const likeItem = async (req, res) => {
  try {
    const userId = req.user_id;
    const item = await ClothingItem.findByIdAndUpdate(
      req.params.itemId,
      { $addToSet: { likes: userId } },
      { new: true }
    );
    if (!item) {
      return res.status(ERROR_404).send({ message: "Clothing item not found" });
    }
    res.status(200).send({ data: item });
  } catch (error) {
    console.error(error);
    if (error.name === "CastError") {
      return res.status(ERROR_400).json({ message: "Invalid request" });
    } else {
      return res.status(ERROR_500).json({ message: "Error from likeItem" });
    }
  }
};

const dislikeItem = async (req, res) => {
  ClothingItem.findByIdAndUpdate(
    req.params.itemId,
    { $pull: { likes: req.user_id } },
    { new: true }
  )
    .then((item) => {
      if (!item) {
        return res
          .status(ERROR_404)
          .json({ message: "Clothing item not found" });
      } else {
        return res.status(200).send({ data: item });
      }
    })
    .catch((error) => {
      console.error(error);
      if (error.name === "CastError") {
        return res
          .status(ERROR_400)
          .json({ message: "Invalid ID in dislikeItem" });
      }
      res.status(ERROR_500).send({ message: "Error from dislikeItem" });
    });
};
module.exports = {
  createItem,
  getItem,
  deleteItem,
  likeItem,
  dislikeItem,
};
