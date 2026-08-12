const mongoose = require("mongoose");
const validator = require("validator");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      minLength: 3,
      maxLength: 20,
    },
    lastName: {
      type: String,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      validate(value) {
        if (!validator.isEmail(value)) {
          throw new Error("Invalid Email Address" + value);
        }
      },
    },
    password: {
      type: String,
      required: true,
      validate(value) {
        if (!validator.isStrongPassword(value)) {
          throw new Error("Enter a strong password" + value);
        }
      },
    },
    age: {
      type: Number,
      min: 18,
    },
    // By DEFAULT validate function runs for new users (post) , not existing ones (patch)
    gender: {
      type: String,
      enum:{
        values:["male","female"],
        message: `{VALUE} is not a valid gender type`,
    }
      // validate(value) {
      //   if (!["male", "female"].includes(value)) {
      //     throw new error("Not a valid gender");
      //   }
      // },
    },
    role: {
      type: String,
    },
    photoUrl: {
      type: String,
      default:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQQchi5sg7mUmbWbRUeVh1Mus0NYioqXle1nMqVk5dcUQ&s=10",
      validate(value) {
        if (!validator.isURL(value)) {
          throw new Error("Invalid photo URL" + value);
        }
      },
    },
    about: {
      type: String,
      default: "This is my default bio",
    },
    skills: {
      type: [String],
    },
  },
  { timestamps: true },
);




userSchema.methods.getJWT = async function () {

  const user = this;

  const token = await jwt.sign({ _id: user._id }, "aayush", {
    expiresIn: "1h",
  });
  
  return token;
};


userSchema.methods.validatePassword = async function (password) {
  
  const user = this;
  const isPasswordValid = await bcrypt.compare(password, user.password);
  return isPasswordValid;
};

 const User = mongoose.model("User", userSchema);

 module.exports = User