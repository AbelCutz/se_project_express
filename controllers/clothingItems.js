const { ERROR_400, ERROR_404, ERROR_500 } = require("../utils/errors");

const clothingItem = require("../models/clothingItem");

const getItem = (req, res) => {
  clothingItem
    .find({})
    .then((items) => res.send({ items }))
    .catch((err) => {
      console.error(
        `Error ${err.name} with the message ${err.message} has occurred while executing the code`
      );
      res.status(ERROR_500).send({ message: "Error from getItems" });
    });
};
const createItem = (req, res) => {
  console.log(req);
  console.log(req.body);
  console.log(req._id);
  const { name, weather, imageUrl, likes } = req.body;
  clothingItem
    .create({ name, weather, imageUrl, likes, owner: req._id })
    .then((item) => res.status(201).send({ data: item }))
    .catch(error);
  console.error(error);
  if (error.name === "ValidationError") {
    return res.status(400).json({ message: error.message });
  } else {
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

const deleteItem = (req, res) => {
  const { itemId } = req.params;
  clothingItem
    .findByIdAndDelete(itemId)
    .orFail(() => {
      const error = new Error("Clothing item not found");
      error.statusCode = ERROR_404;
      throw error;
    })
    .then((items) => res.status(200).send(items))
    .catch((err) => {
      console.error(
        `Error ${err.name} with the message ${err.message} has occurred while executing the code`
      );
      res.status(500).send({ message: "Error from deleteItems", error: e });
    });
};

const likeItem = (req, res) => {
  const userId = req.user_id;
  clothingItem
    .findByIdAndUpdate(
      req.params.itemId,
      { $addToSet: { likes: userId } },
      { new: true }
    )
    .orFail()
    .then((item) => res.status(200).send({ data: item }))
    .catch((err) => {
      console.error(
        `Error ${err.name} with the message ${err.message} has occurred while executing the code`
      );
      res.status(500).send({ message: "Error from likeItem", error: e });
    });
};

const dislikeItem = (req, res) => {
  clothingItem
    .findByIdAndUpadate(
      req.params.itemId,
      { $pull: { likes: userId } },
      { new: true }
    )
    .orFail()
    .then((item) => res.status(200).send({ data: item }))
    .catch((err) => {
      console.error(
        `Error ${err.name} with the message ${err.message} has occurred while executing the code`
      );
      res.status(500).send({ message: "Error from dislikeItem", error: e });
    });
};

module.exports = {
  createItem,
  getItem,
  deleteItem,
  likeItem,
  dislikeItem,
};
