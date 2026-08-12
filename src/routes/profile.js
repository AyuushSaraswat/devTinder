const express = require("express");
const userAuth = require("../middlewares/authMiddleware");
const profileRouter = express.Router();
const User = require("../models/userModel.js");
const validator = require("validator");
const bcrypt = require("bcrypt");
const { validateEditProfile } = require("../utils/validation.js");

profileRouter.get("/view", userAuth, async (req, res) => {
  try {
    const user = req.user;
    res.send(user);
  } catch (error) {
    res.send("Error: " + error.message);
  }
});

profileRouter.patch("/edit", userAuth, async (req, res) => {
  try {
    if (!validateEditProfile(req)) {
      throw Error("Invalid Edit Request");
    }

    const user = req.user;

    Object.keys(req.body).forEach((key) => (user[key] = req.body[key]));

    user.save();

    res.json({
      status: 200,
      message: `${user.firstName}, your profile is updated}`,
      data: user,
    });
  } catch (error) {
    res.send("Error: " + error.message);
  }
});

profileRouter.patch("/password", userAuth, async (req, res) => {
  try {
    const { password } = req.body;

    if (!validator.isStrongPassword(password)) {
      throw Error("Enter a Strong Password ");
    }

    const user = req.user;

    const isPassMatch = await user.validatePassword(password);

    if (isPassMatch) {
      return res.send("You Entered a old password , Try new One");
    } else {
      const hashedPass = await bcrypt.hash(password, 10);

      user.password = hashedPass;

      await user.save();

      res.send(`${user.firstName} your password has been Updated`);
    }
  } catch (error) {
    res.send("Error: " + error.message);
  }
});

module.exports = profileRouter;
