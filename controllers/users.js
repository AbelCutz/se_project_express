const { NODE_ENV, JWT_SECRET } = process.env;
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const { BadRequestError } = require("../middlewares/BadRequestError");
const { UnauthorizedError } = require("../middlewares/UnauthorizedError");
const { NotFoundError } = require("../middlewares/NotFoundError");
const { ConflictError } = require("../middlewares/ConflictError");

const getCurrentUser = async (req, res, next) => {
  try {
    const userId = req.user._id;

    const user = await User.findById(userId);

    if (!user) {
      return next(new NotFoundError("User not found"));
    }

    const response = {
      _id: user._id,
      name: user.name,
      avatar: user.avatar,
      email: user.email,
    };
    return res.status(200).json(response);
  } catch (error) {
    console.error(error);
    if (error.name === "ValidationError" || error.name === "CastError") {
      next(new BadRequestError("Invalid request"));
    } else {
      next(error);
    }
  }
};

const createUser = async (req, res, next) => {
  try {
    const { name, avatar, email, password } = req.body;

    const hashedPassword = await bcrypt.hash(password, 10);

    await User.create({
      name,
      avatar,
      email,
      password: hashedPassword,
    });

    const savedUser = {
      name,
      avatar,
      email,
    };
    return res.status(201).json({ data: savedUser });
  } catch (error) {
    console.error(error);
    if (error.code === 11000) {
      next(new ConflictError("User with this email already exists"));
    }
    if (error.name === "ValidationError") {
      next(new BadRequestError("User with this email already exists"));
    }
    next(error);
  }
};

const login = async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    next(new BadRequestError(" Incorrect email or password"))();
  }
  try {
    const user = await User.findUserByCredentials(email, password);

    const token = jwt.sign(
      { _id: user._id },
      NODE_ENV === "production" ? JWT_SECRET : "dev-secret",
      { expiresIn: "7d" }
    );

    return res.status(200).json({ token });
  } catch (error) {
    console.error(error);
    if (error.message === " Incorrect email or password") {
      next(new UnauthorizedError(" Incorrect email or password"));
    }
    next(error);
  }
};

const updateProfile = async (req, res, next) => {
  try {
    const { name, avatar } = req.body;

    if (!name && !avatar) {
      next(new BadRequestError("Name or Avatar is required for update"));
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
      next(new NotFoundError("User not found"));
    }
    return res.status(200).json(user);
  } catch (error) {
    if (error.name === "ValidationError") {
      next(new BadRequestError("Incorrect user"));
    }
    next(error);
  }
};

module.exports = {
  createUser,
  login,
  getCurrentUser,
  updateProfile,
};
