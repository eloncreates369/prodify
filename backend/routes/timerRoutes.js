const express = require("express");
const router = express.Router();

const Task = require("../models/Task");
const auth = require("../middleware/auth");

/* SAVE TIMER LOG */

router.post("/", auth, async (req, res) => {

  try {

    const { taskId, seconds } = req.body;

    const task = await Task.findById(taskId);

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    task.timerLog.push({
      date: new Date(),
      seconds
    });

    await task.save();

    res.json({ message: "Timer saved successfully" });

  } catch (err) {

    res.status(500).json({ message: "Timer save failed" });

  }

});

module.exports = router;