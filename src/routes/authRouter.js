const express = require("express");
const User = require("../model/User");
const { validateSignUp } = require("../utils/validation");
const jwt = require("jsonwebtoken");

const authRoute = express.Router();

authRoute.post("/signup", async (req, res) => {
  try {
    validateSignUp(req);

    const user = new User(req.body);
    const savedUser = await user.save();

    res.send(savedUser);
  } catch (err) {
    console.error("Signup Error:", err);
    res.status(400).send(err.message);
  }
});

authRoute.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email: email });
    if (!user) {
      throw new Error("Invalid Credentials");
    }

    const verifiyPassword = await user.validatePassword(password);

    if (!verifiyPassword) {
      throw new Error("Invalid Credentials");
    }

    const token = await user.getJWT();
    res.cookie("token", token);

    res.send("User login Successfully");
  } catch (error) {
    res.status(400).send("Error: " + error.message);
  }
});

authRoute.post("/logout", (req, res) => {
  res.cookie("token", null, {
    expires: new Date(Date.now()),
  });
  res.send("User Logout Successfull");
});

module.exports = { authRoute };
