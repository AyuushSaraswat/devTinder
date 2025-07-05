const mongoose = require("mongoose")

const dbConnect = async () => {
  try {
    await mongoose.connect(
      "mongodb+srv://ayush:saraswat@cluster0.jlsumgu.mongodb.net/devTinder"
    );
    console.log("Database Connected Successfully");
  } catch (error) {
    console.log("Database Connection Failed");
    console.log(error);
    process.exit(1);
  }
};

module.exports = dbConnect