const express = require("express");
const connectDB = require("./config/database");
const cookieParser = require("cookie-parser");
const { authRoute } = require("./routes/authRouter");
const { profileRoute } = require("./routes/profileRouter");
const { requestRoute } = require("./routes/requestRouter");

const app = express();

console.log("Server file loded");
app.use(cookieParser());
app.use(express.json());

app.use("/", authRoute);
app.use("/", profileRoute);
app.use("/", requestRoute);

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
