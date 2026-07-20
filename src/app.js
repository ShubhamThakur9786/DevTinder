const express = require("express");
const connectDB = require("./config/database");
const User = require("./model/User");
const app = express();

app.post("/signup", async (req, res) => {
  const data = {
    firstName: "Virat",
    lastName: "kholi",
    email: "viratkholi@gmail.com",
    password: "Anom@9786",
  };

  try {
    const user = new User(data);
    await user.save();
    res.status(200).json({ message: "Saved data to db" });
  } catch (error) {
    res.status(400).send("Error saving the data");
  }
});

connectDB()
  .then(() => {
    console.log("Database connected successfully ✅");
    app.listen(7777, () => {
      console.log("Server is listning on port no. 7777");
    });
  })
  .catch((error) => {
    console.log("Database doesn't connected ❌");
  });
