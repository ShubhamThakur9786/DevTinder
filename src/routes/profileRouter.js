const express = require("express");
const { userAuth } = require("../middleware/auth");
const { validateProfileData } = require("../utils/validation");
const bcrypt = require("bcrypt");
const validator = require("validator");

const profileRoute = express.Router();

profileRoute.get("/profile", userAuth, async (req, res) => {
  try {
    const user = req.user;
    res.send(user);
  } catch (error) {
    res.status(400).send("Error: " + error);
  }
});

profileRoute.patch("/profile/edit", userAuth, async (req, res) => {
  try {
    if (!validateProfileData(req)) {
      throw new Error("these fields are not allowed to update");
    }

    const loggedInUser = req.user;
    for (const key of Object.keys(req.body)) {
      loggedInUser[key] = req.body[key];
    }

    await loggedInUser.save();

    res.status(200).json({
      message: `${loggedInUser.firstName} your profile updated successfully`,
      data: loggedInUser,
    });
  } catch (error) {
    res.status(400).send("Error in /profile/edit route " + error.message);
  }
});

profileRoute.patch("/profile/password", userAuth, async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;
    if (!oldPassword || !newPassword) {
      throw new Error("Old password and new password are required");
    }

    const loggedInUser = req.user;

    const isValid = await loggedInUser.validatePassword(oldPassword);

    if (!isValid) {
      throw new Error("Password is not correct");
    }

    const isStrongPasw = validator.isStrongPassword(newPassword);
    if (!isStrongPasw) {
      throw new Error("Please enter the strong password");
    }

    loggedInUser.password = newPassword;
    await loggedInUser.save();

    res.status(201).json({
      message: `${loggedInUser.firstName} your password updated successfull`,
      data: loggedInUser,
    });
  } catch (error) {
    res.status(400).send("Error in /profile/password route " + error.message);
  }
});

module.exports = { profileRoute };

// $2b$10$VtKMteSbPhHLQXWWs9Z/CuHRFuwiz8C1YcObkivGgiAfwgTYoCK6.
