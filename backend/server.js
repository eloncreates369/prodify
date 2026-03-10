require("dotenv").config();

const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const Task = require("./models/Task");
const User = require("./models/User");
const auth = require("./middleware/auth");

const SECRET = "prodify_secret";

const timerRoutes = require("./routes/timerRoutes");

const app = express();

/* MIDDLEWARE */

app.use(cors());
app.use(express.json());

/* CONNECT TO DATABASE */

mongoose.connect(process.env.MONGO_URI)
.then(() => {
  console.log("MongoDB connected");
})
.catch((err) => {
  console.error("MongoDB connection error:", err);
});

/* TEST ROUTE */

app.get("/", (req, res) => {
  res.send("Prodify backend running 🚀");
});



/* ========================= */
/* REGISTER USER */
/* ========================= */

app.post("/api/register", async (req, res) => {

  try {

    const { email, password } = req.body;

    const existing = await User.findOne({ email });

    if (existing) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({
      email,
      password: hashedPassword
    });

    await user.save();

    res.json({ message: "User registered successfully" });

  } catch (err) {

    res.status(500).json({ error: "Registration failed" });

  }

});



/* ========================= */
/* LOGIN USER */
/* ========================= */

app.post("/api/login", async (req, res) => {

  try {

    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    const valid = await bcrypt.compare(password, user.password);

    if (!valid) {
      return res.status(400).json({ message: "Invalid password" });
    }

    const token = jwt.sign(
      { userId: user._id },
      SECRET
    );

    res.json({ token });

  } catch (err) {

    res.status(500).json({ error: "Login failed" });

  }

});



/* ========================= */
/* CREATE TASK (PROTECTED) */
/* ========================= */

app.post("/api/tasks", auth, async (req, res) => {

  try {

    const task = new Task({
      ...req.body,
      userId: req.userId
    });

    await task.save();

    res.json(task);

  } catch (error) {

    res.status(500).json({ error: "Failed to create task" });

  }

});



/* ========================= */
/* GET USER TASKS */
/* ========================= */

app.get("/api/tasks", auth, async (req, res) => {

  try {

    const tasks = await Task.find({
      userId: req.userId
    });

    res.json(tasks);

  } catch (error) {

    res.status(500).json({ error: "Failed to fetch tasks" });

  }

});



/* ========================= */
/* DELETE TASK */
/* ========================= */

app.delete("/api/tasks/:id", auth, async (req, res) => {

  try {

    await Task.findByIdAndDelete(req.params.id);

    res.json({ message: "Task deleted successfully" });

  } catch (error) {

    res.status(500).json({ error: "Failed to delete task" });

  }

});

app.put("/api/tasks/:id", auth, async (req,res)=>{

  try{

    const task = await Task.findOneAndUpdate(
      {_id:req.params.id, userId:req.userId},
      req.body,
      {new:true}
    );

    res.json(task);

  }catch(err){
    res.status(500).json({error:"Failed to update task"});
  }

});

app.get("/api/me", auth, async (req,res)=>{

  const user = await User.findById(req.userId).select("-password");

  res.json(user);

});


app.use("/api/timer", timerRoutes);

/* START SERVER */

const PORT = 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});