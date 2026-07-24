const validator = require("validator");

const validateSignUp = (req) => {
  const { firstName, lastName, email, password } = req.body;

  if (!firstName || !email || !password) {
    throw new Error("Please fills all the details");
  }

  if (firstName.length < 4 || firstName.length > 50) {
    throw new Error("FirstName should be in between 4 to 50 characters");
  }

  if (!validator.isEmail(email)) {
    throw new Error("Please enter a valid email addresss");
  }

  if (!validator.isStrongPassword(password)) {
    throw new Error("Please enter a strong password");
  }
};

const validateProfileData = (req) => {
  const allowedUpdates = [
    "firstName",
    "lastName",
    "age",
    "about",
    "photoUrl",
    "skills",
  ];

  const isAllowedToUpdate = Object.keys(req.body).every((key) =>
    allowedUpdates.includes(key)
  );

  return isAllowedToUpdate;
};

module.exports = { validateSignUp, validateProfileData };
