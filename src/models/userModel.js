const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      minLength:3,
      maxLength:20
    },
    lastName: {
      type: String,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase:true,
      trim:true
    },
    password: {
      type: String,
      required: true,
    },
    age: {
      type: Number,
      min:18
    },
    // By DEFAULT validate function runs for new users , not existing ones
    gender: {
      type: String,
      validate(value){
        if(!["male","female"].includes(value)){
          throw new error("Not a valid gender")
        }
      }
    },
    role: {
      type: String,
    },
    photoUrl: {
      type: String,
      default:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQQchi5sg7mUmbWbRUeVh1Mus0NYioqXle1nMqVk5dcUQ&s=10",
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

module.exports = mongoose.model("User", userSchema);
