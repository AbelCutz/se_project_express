const express = require("express");
const router = require("express").Router();

const {
  createUser,
  getUsers,
  updateUser,
  deleteUser,
  getUser,
} = require("../controllers/users");

router.post("/", createUser);

router.get("/", getUsers);

router.put("/:userId", updateUser);

router.delete("/:userId", deleteUser);

router.get("/:userId", getUser);

module.exports = router;
