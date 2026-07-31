const express = require("express");
const app = express();
const bcrypt = require("bcrypt");
const dbConnect = require("./config/database.js");
const User = require("./models/userModel.js");
app.use(express.json());
const vaildateSignUpData = require("./utils/validation.js");
const userModel = require("./models/userModel.js");

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

    const user = await userModel.findOne({ email });

    if (!user) {
      throw new Error("Invalid Credentials");
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      throw new Error("Invalid Credentials");
    }

    res.send("Login Successfull");
  } catch (error) {
    res.send("Login Failed: " + error.message);
  }
});

// Read single user using findOne
app.get("/user", async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      return res.status(404).send("User not found");
    }
    res.status(200).send(user);
  } catch (error) {
    res.status(500).send("Error fetching the user", error.message);
  }
});

// Read all users using find({})
app.get("/feed", async (req, res) => {
  try {
    const user = await User.find({});
    if (user.length === 0) {
      res.send("Failed to fetch users");
    }
    res.status(200).send(user);
  } catch (error) {
    res.status(500).send("Error fetching the user", error.message);
  }
});

// Deleting a user
app.delete("/user", async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.body.userID);
    res.status(200).send("User Deleted");
  } catch (error) {
    res.status(500).send("Error Deleting the user", error.message);
  }
});

app.patch("/user/:id", async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.id, req.body, {
      returnDocument: "before",
      runValidators: true, // Set it true to run validate() function on updating a user (patch)
    });
    console.log(user);
    res.status(200).send("User Updated");
  } catch (error) {
    res.status(500).send("Error Updating the user", error.message);
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
