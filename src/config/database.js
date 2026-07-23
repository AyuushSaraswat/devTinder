const mongoose = require("mongoose");

const dbConnect = async () => {
  await mongoose.connect(
    "mongodb+srv://ayush:saraswat@cluster0.jffvh0z.mongodb.net/",
  );
};

module.exports = dbConnect;
