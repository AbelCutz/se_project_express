const User = require("../models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../utils/config");
const {
  ERROR_400,
  ERROR_401,
  ERROR_404,
  ERROR_500,
} = require("../utils/errors");

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

const getCurrentUser = async (req, res) => {
  try {
    const userData = req.user;

    const response = {
      _id: userData._id,
      name: userData.name,
      email: userData.email,
    };
    return res.status(200).json(response);
  } catch (error) {
    console.error(error);
    return res.status(ERROR_500).json({ message: "Internal Sever Error" });
  }
};

const createUser = async (req, res) => {
  try {
    const { name, avatar, email, password } = req.body;
    if (!name || !avatar || !email || !password) {
      return res
        .status(ERROR_400)
        .json({ message: "Name, Avatar, Eamil and Password are required" });
    }

    const existingUser = await User.findOne({ email }.select("+password"));
    if (existingUser) {
      return res
        .status(ERROR_400)
        .json({ message: "User with this email already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({ name, avatar, email, password: hashedPassword });
    const savedUser = await newUser.save();

    return res.status(201).json(savedUser);
  } catch (error) {
    console.error(error);
    if (error.code === 11000) {
      return res
        .status(ERROR_400)
        .json({ message: "User with this email already exists" });
    }
    if (error.name === "ValidationError") {
      return res.status(ERROR_400).json({ message: error.message });
    }
    return res.status(ERROR_500).json({ error: "Internal Server Error" });
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findUserByCredentials({ email });
    if (!user) {
      throw new Error("Incorrect email or password");
    }

    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (!isPasswordMatch) {
      throw new Error("Incorrect email or password");
    }

    const token = jwt.sign({ _id: user._id }, JWT_SECRET, { expiresIn: "7d" });
    return res.status(200).json({ token });
  } catch (error) {
    return res.status(ERROR_401).json({ message: error.message });
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

const updateProfile = async (req, res) => {
  try {
    const { name, avatar } = req.body;

    if (!name && !avatar) {
      return res
        .status(ERROR_400)
        .json({ message: "Name or Avatar is required for update" });
    }

    const updatedUser = {};
    if (name) updatedUser.name = name;
    if (avatar) updatedUser.avatar = avatar;

    const userId = req.user._id;
    const user = await User.findByIdAndUpdate(
      userId,
      { $set: updatedUser },
      { new: true, runValidators: true }
    );

    if (!user) {
      return res.status(ERROR_404).json({ message: "User not found" });
    }
    return res.status(200).json(user);
  } catch (error) {
    if (error.name === "ValidationError") {
      return res.status(ERROR_400).json({ message: "Internal Server Error" });
    }
  }
};

module.exports = {
  getUsers,
  getUser,
  createUser,
  updateUser,
  login,
  getCurrentUser,
  updateProfile,
};
