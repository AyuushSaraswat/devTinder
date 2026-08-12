const express = require("express");
const app = express();
const dbConnect = require("./config/database.js");
const User = require("./models/userModel.js");
const validator = require("validator");
const cookieParser = require("cookie-parser");


const authRouter = require("./routes/auth.js")
const profileRouter = require("./routes/profile.js")
const requestRouter = require("./routes/request.js");
const userRouter = require("./routes/user.js");



app.use(express.json());
app.use(cookieParser());
app.use('/auth',authRouter)
app.use('/profile',profileRouter)
app.use('/request',requestRouter)
app.use('/user',userRouter)


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
