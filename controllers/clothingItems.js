const ClothingItem = require("../models/clothingItem");
const { BadRequestError } = require("../middlewares/BadRequestError");
const { ForbiddenError } = require("../middlewares/ForbiddenError");
const { NotFoundError } = require("../middlewares/NotFoundError");

const getItem = (req, res, next) => {
  ClothingItem.find({})
    .then((items) => res.send({ items }))
    .catch((error) => {
      console.error(error);
      next(error);
    });
};
const createItem = async (req, res, next) => {
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
      next(new BadRequestError("Invaild request to create item"));
    }
    return next(error);
  }
};

const deleteItem = async (req, res, next) => {
  try {
    const { itemId } = req.params;
    const userId = req.user._id;

    const item = await ClothingItem.findById(itemId);

    if (!item) {
      return next(new NotFoundError("Clothing item not found"));
    }

    if (item.owner.toString() !== userId.toString()) {
      return next(
        new ForbiddenError("You do not have permission to delete this item")
      );
    }
    await item.remove();
    return res.status(200).json({ itemId });
  } catch (error) {
    console.error(error);
    if (error.name === "CastError") {
      next(new BadRequestError("Invalid ID in deleteItem"));
    }
    return next(error);
  }
};

const likeItem = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const item = await ClothingItem.findByIdAndUpdate(
      req.params.itemId,
      { $addToSet: { likes: userId } },
      { new: true }
    );
    if (!item) {
      next(new NotFoundError("Clothing item not found"));
    }
    return res.status(200).send({ data: item });
  } catch (error) {
    console.error(error);
    if (error.name === "CastError") {
      next(new BadRequestError("Invalid request"));
    }
    return next(error);
  }
};

const dislikeItem = async (req, res, next) => {
  ClothingItem.findByIdAndUpdate(
    req.params.itemId,
    { $pull: { likes: req.user._id } },
    { new: true }
  )
    .then((item) => {
      if (!item) {
        return next(new NotFoundError("Clothing item not found"));
      }
      return res.status(200).send({ data: item });
    })
    .catch((error) => {
      console.error(error);
      if (error.name === "CastError") {
        next(new BadRequestError("Invalid ID in dislikeItem"));
      }
      return next(error);
    });
};
module.exports = {
  createItem,
  getItem,
  deleteItem,
  likeItem,
  dislikeItem,
};
