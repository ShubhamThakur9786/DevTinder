const express = require("express");
const { userAuth } = require("../middleware/auth");

const requestRoute = express.Router();

requestRoute.post("/sendconnectionrequest", userAuth, (req, res) => {
  try {
    const user = req.user;
    res.send(user.firstName + " sent connection request");
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = { requestRoute };
