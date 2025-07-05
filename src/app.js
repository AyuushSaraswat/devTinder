const express = require("express");
const dbConnect = require("./config/database.js");
const app = express();
const user = require("./models/userModel.js");
dbConnect();

app.post("/signup", async (req, res) => {
  try {
    const User = new user({
      firstName: "Ayush",
      lastName: "Saraswat",
      email: "ayush@test.com",
      password: "ayush@123",
    });

    await User.save();
    res.send("User created successfully");

  } 
  catch (error) {
    console.log("Error creating User");
    console.log(error.message);
    res.status(500).send("Failed to create user");
  }
});

app.listen(7777, () => {
  console.log("Server is Started");
});
