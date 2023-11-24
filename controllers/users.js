const User = require("../models/user");

const getUsers = async (req, res) => {
  try {
    const user = await User.find();
    res.json(user);
  } catch (error) {
    console.error(error);
    if (error.name === "ValidationError") {
      return res.status(400).json({ message: error.message });
    } else {
      return res.status(500).json({ error: "Internal Server Error" });
    }
  }
};

const getUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const userData = await User.findById(userId).orFail();
    res.status(200).json({ data: userData });
  } catch (error) {
    console.error(error);
    if (error.name === "CastError") {
      return res.status(400).json({ message: "Not a vailid Id" });
    }
    if (error.name === "DocumentNotFoundError") {
      return res.status(404).json({ maessag: "User not found" });
    } else {
      return res.status(500).json({ error: "Internal Server Error" });
    }
  }
};

const createUser = async (req, res) => {
  try {
    const { name, avatar } = req.body;
    if (!name || !avatar) {
      return res.status(400).json({ message: "Name and Avatar are required" });
    }
    const newUser = new User({ name, avatar });
    const savedUser = await newUser.save();

    res.status(201).json(savedUser);
  } catch (error) {
    console.error(error);
    if (error.name === "ValidationError") {
      return res.status(400).json({ message: error.message });
    } else {
      return res.status(500).json({ error: "Internal Server Error" });
    }
  }
};

const updateUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const { name, avatar } = req.body;
    const updateUser = await User.findByIdAndUpdate(
      userId,
      { name, avatar },
      { new: true }
    );
    if (!updateUser) {
      return res.status(404).json({ error: "User not found" });
    }
    res.json(updateUser);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const deleteUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const deleteUser = await User.findByIdAndDelete(userId);
    if (!deleteUser) {
      return res.status(404).json({ error: "User not found" });
    }
    res.json({ message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};
module.exports = {
  getUsers,
  getUser,
  createUser,
  updateUser,
  deleteUser,
};
