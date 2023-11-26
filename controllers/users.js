const User = require("../models/user");
const { ERROR_400, ERROR_404, ERROR_500 } = require("../utils/errors");

const getUsers = async (req, res) => {
  try {
    const user = await User.find();
    return res.json(user);
  } catch (error) {
    console.error(error);
    return res.status(ERROR_500).json({ error: "Internal Server Error" });
  }
};

const getUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const userData = await User.findById(userId).orFail();
    return res.status(200).json({ data: userData });
  } catch (error) {
    console.error(error);
    if (error.name === "CastError") {
      return res.status(ERROR_400).json({ message: "Not a vailid Id" });
    }
    if (error.name === "DocumentNotFoundError") {
      return res.status(ERROR_404).json({ message: "User not found" });
    }
    return res.status(ERROR_500).json({ error: "Internal Server Error" });
  }
};

const createUser = async (req, res) => {
  try {
    const { name, avatar } = req.body;
    if (!name || !avatar) {
      return res
        .status(ERROR_400)
        .json({ message: "Name and Avatar are required" });
    }
    const newUser = new User({ name, avatar });
    const savedUser = await newUser.save();

    return res.status(201).json(savedUser);
  } catch (error) {
    console.error(error);
    if (error.name === "ValidationError") {
      return res.status(ERROR_400).json({ message: error.message });
    }
    return res.status(ERROR_500).json({ error: "Internal Server Error" });
  }
};

const updateUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const { name, avatar } = req.body;
    const updatesUser = await User.findByIdAndUpdate(
      userId,
      { name, avatar },
      { new: true }
    );
    if (!updatesUser) {
      return res.status(ERROR_404).json({ error: "User not found" });
    }
    return res.json(updatesUser);
  } catch (error) {
    return res.status(ERROR_500).json({ error: "Internal Server Error" });
  }
};
module.exports = {
  getUsers,
  getUser,
  createUser,
  updateUser,
};
