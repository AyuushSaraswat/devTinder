const validator = require("validator")

const vaildateSignUpData = (req) => {
  const { firstName, lastName, email, password } = req.body;

  if (!firstName || !lastName || !email || !password) {
    throw new Error("Please Enter all the Details");

  } else if (!validator.isEmail(email)) {
    throw new Error("Please Enter Valid email");
    
  } else if (!validator.isStrongPassword(password)) {
    throw new Error("Please enter strong password");
  }

};

const validateEditProfile = (req) => {

 const allowedFields = ["firstName","lastName","age","about","skills","photoUrl","gender"];

  const editAllowedFields = Object.keys(req.body).every((key)=>allowedFields.includes(key))

  return editAllowedFields

}



module.exports = {vaildateSignUpData,validateEditProfile}