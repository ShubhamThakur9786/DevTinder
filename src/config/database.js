const mongoose = require("mongoose");

async function connectDB() {
  await mongoose.connect(
    "mongodb+srv://NamasteNodeJs:ShubhamSingh@cluster0.thul58s.mongodb.net/devTinder"
  );
}

module.exports = connectDB;
