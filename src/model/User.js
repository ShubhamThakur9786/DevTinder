const mongoose = require("mongoose");
const validator = require("validator");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      minlength: 4,
      maxlength: 50,
    },
    lastName: {
      type: String,
      minlength: 4,
      maxlength: 50,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
    },
    age: {
      type: Number,
      min: 18,
      max: 50,
    },
    gender: {
      type: String,
      lowercase: true,
      validate(value) {
        if (!["male", "female", "others"].includes(value)) {
          throw new Error("Gender is not valid");
        }
      },
    },
    about: {
      type: String,
      default: "Tell me about yourself",
    },
    skills: {
      type: [String],
      default: [],
    },
    photoUrl: {
      type: String,
      default:
        "https://mooddp.com/wp-content/uploads/2025/10/deep-dp-for-whatsapp-girl.webp",
      validate(val) {
        if (!validator.isURL(val)) {
          throw new Error("Invalid photo url" + val);
        }
      },
    },
  },
  {
    timestamps: true,
  }
);

userSchema.methods.getJWT = async function () {
  const secretKey = "DevTinder@ShubhamThakur";
  const user = this;
  const token = await jwt.sign({ _id: user._id }, secretKey, {
    expiresIn: "7d",
  });
  return token;
};

userSchema.pre("save", async function () {
  if (!this.isModified("password")) return;

  this.password = await bcrypt.hash(this.password, 10);
});

userSchema.methods.validatePassword = async function (inputPassword) {
  const isPasswordValid = await bcrypt.compare(inputPassword, this.password);

  return isPasswordValid;
};

module.exports = mongoose.model("User", userSchema);
