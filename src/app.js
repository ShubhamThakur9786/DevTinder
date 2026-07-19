const express = require("express");

const app = express();

app.use("/test", (req, res) => {
  res.send("This is test route");
});

app.use("", (req, res) => {
  res.send("This is / route");
});

app.listen(7777, () => {
  console.log("Server is listning on port no. 7777");
});
