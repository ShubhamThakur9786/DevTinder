const jwt = require("jsonwebtoken");
const User = require("../model/User");

const userAuth = async (req, res, next) => {
  try {
    const { token } = req.cookies;
    if (!token) {
      return res.status(401).json({
        message: "Token is missing",
      });
    }
    const secretKey = "DevTinder@ShubhamThakur";
    const decodedjwt = await jwt.verify(token, secretKey);

    const { _id } = decodedjwt;

    const user = await User.findById(_id);
    if (!user) {
      return res.status(404).json({
        message: "User does not exist",
      });
    }

    req.user = user;
    next();
  } catch (error) {
    res.status(400).send("Error: " + error.message);
  }
};

module.exports = { userAuth };
