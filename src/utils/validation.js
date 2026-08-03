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


module.exports = vaildateSignUpData