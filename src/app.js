const express = require("express");
const app = express();
const dbConnect = require("./config/database.js");

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
