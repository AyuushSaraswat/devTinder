const express = require("express");
const {vaildateSignUpData} = require("../utils/validation");
const validator = require("validator");
const User = require("../models/userModel.js");
const authRouter = express.Router();
const bcrypt = require("bcrypt");

authRouter.post("/signup", async (req, res) => {
  try {
    vaildateSignUpData(req);

    const { firstName, lastName, email, password } = req.body;

    const hashedPass = await bcrypt.hash(password, 10);

    const user = new User({
      firstName,
      lastName,
      email,
      password: hashedPass,
    });

    await user.save();

    res.send("User Added Successfully");
  } catch (error) {
    res.send("Error Saving user: " + error.message);
  }
});

authRouter.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!validator.isEmail(email)) {
      throw new Error("Email is not Valid");
    }

    const user = await User.findOne({ email });

    if (!user) {
      throw new Error("Invalid Credentials");
    }

    const isMatch = await user.validatePassword(password);

    if (!isMatch) {
      throw new Error("Invalid Credentials");
    }

    const token = await user.getJWT();

    res.cookie("token", token, {
      expires: new Date(Date.now() + 10 * 60 * 60 * 1000),
    });

    res.send("Login Successfull");
  } catch (error) {
    res.send("Login Failed: " + error.message);
  }
});

authRouter.post("/logout", async (req, res) => {
  res.cookie("token", null, { expires: new Date(Date.now()) });
  res.send("Logout successfully")
});

module.exports = authRouter;
