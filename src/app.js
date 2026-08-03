const express = require("express");
const app = express();
const bcrypt = require("bcrypt");
const dbConnect = require("./config/database.js");
const User = require("./models/userModel.js");
const vaildateSignUpData = require("./utils/validation.js");
const validator = require("validator");
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");
const userAuth = require("./middlewares/authMiddleware.js");

app.use(express.json());
app.use(cookieParser());

// Create user
app.post("/signup", async (req, res) => {
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

app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!validator.isEmail(email)) {
      throw new Error("Email is not Valid");
    }

    const user = await User.findOne({ email });

    if (!user) {
      throw new Error("Invalid Credentials");
    }

    const isMatch = await user.validatePassword(password)


    if (!isMatch) {
      throw new Error("Invalid Credentials");
    }

    const token = await user.getJWT()


    res.cookie("token", token, {
      expires: new Date(Date.now() + 10 * 60 * 60 * 1000),
    });

    res.send("Login Successfull");
  } catch (error) {
    res.send("Login Failed: " + error.message);
  }
});

app.get("/profile", userAuth, async (req, res) => {
  try {
    const user = req.user;
    res.send(user);
  } catch (error) {
    res.send("Error: " + error.message);
  }
});

dbConnect()
  .then(() => {
    console.log("Database Connected Successfully");
    app.listen(7777, () => {
      console.log("Server is listening on port 7777");
    });
  })
  .catch((err) => {
    console.log(err);
  });
