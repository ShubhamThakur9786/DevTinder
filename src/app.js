const express = require("express");
const connectDB = require("./config/database");
const User = require("./model/User");
const bcrypt = require("bcrypt");
const { validateSignUp } = require("./utils/validation");
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");
const app = express();

console.log("Server file loded");
app.use(cookieParser());
app.use(express.json());

app.delete("/user", async (req, res) => {
  try {
    const userId = req.body.userId;
    const userToBeDeleted = await User.findByIdAndDelete({ _id: userId });
    //const userToBeDeleted = User.findByIdAndDelete(userId); both same
    res.send(userToBeDeleted);
  } catch (error) {
    res.status(400).json({ message: "Error in delting the user" });
  }
});

app.patch("/user/:userId", async (req, res) => {
  try {
    const userId = req.params?.userId;
    const updatedData = req.body;

    const allowedUpdates = ["gender", "age", "about", "photoUrl"];
    const isUpdateAllowed = Object.keys(updatedData).every((k) =>
      allowedUpdates.includes(k)
    );

    if (!isUpdateAllowed) {
      throw new Error("Update are not allowed");
    }
    const userUpdated = await User.findByIdAndUpdate(userId, updatedData, {
      returnDocument: "before",
    });

    res.send(userUpdated);
  } catch (error) {
    res.status(400).json({ message: "Error in updating the user" });
  }
});

app.get("/user", async (req, res) => {
  try {
    const userEmail = req.body.email;
    if (!userEmail) {
      res.send("Please enter valid email address");
    }

    const users = await User.find({ email: userEmail });
    res.send(users);
  } catch (error) {
    res.status(400).json({ message: "no email is existed like this" });
  }
});

app.get("/feed", async (req, res) => {
  try {
    const users = await User.find({});
    if (!users) {
      res.send("There is no users in database");
    }
    res.send(users);
  } catch (error) {
    res.status(400).json({ message: "Not found" });
  }
});

app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email: email });
    if (!user) {
      throw new Error("Invalid Credentials");
    }

    const verifiyPassword = await bcrypt.compare(password, user.password);

    if (!verifiyPassword) {
      throw new Error("Invalid Credentials");
    }

    const secretKey = "DevTinder@ShubhamThakur";

    const token = await jwt.sign({ _id: user._id }, secretKey);
    res.cookie("token", token);

    res.send("User login Successfully");
  } catch (error) {
    res.status(400).send("Error: " + error.message);
  }
});

app.get("/profile", async (req, res) => {
  try {
    const cookies = req.cookies;
    console.log(cookies);
    const { token } = cookies;
    if (!token) {
      throw new Error("Token is invalid");
    }
    const secretKey = "DevTinder@ShubhamThakur";
    const decoded = await jwt.verify(token, secretKey);
    const { _id } = decoded;

    const user = await User.findById(_id);
    if (!user) {
      throw new Error("There is no user exists");
    }
    res.send(user);
  } catch (error) {
    res.status(400).send("Error: " + error);
  }
});

app.post("/signup", async (req, res) => {
  try {
    validateSignUp(req);

    const { password } = req.body;

    const hashPassword = await bcrypt.hash(password, 10);

    const user = new User({
      ...req.body,
      password: hashPassword,
    });
    const savedUser = await user.save();

    res.send(savedUser);
  } catch (err) {
    console.error("Signup Error:", err);
    res.status(400).send(err.message);
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
