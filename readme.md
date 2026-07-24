// app.post("/signup", async (req, res) => {
// const data = {
// firstName: "Virat",
// lastName: "kholi",
// email: "viratkholi@gmail.com",
// password: "Anom@9786",
// };

// try {
// const user = new User(data);
// await user.save();
// res.status(200).json({ message: "Saved data to db" });
// } catch (error) {
// res.status(400).send("Error saving the data");
// }
// });

app.delete("/user", async (req, res) => {
try {
const userId = req.body.userId;
const userToBeDeleted = await User.findByIdAndDelete({ \_id: userId });
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
