const express = require("express");
const app = express();
const dbConnect = require("./config/database.js");
const User = require("./models/userModel.js");

const data = {
  name: "Ayush",
  email: "ayush@gmail.com",
  age: 27,
  gender: "male",
};

app.post("/create", async (req, res) => {
  try {
    const user = await new User(data);
    user.role = "Admin";
    await user.save();
    res.send("User Added Successfully");
  } catch (error) {
    res.send("Error Saving user", error.message);
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
