const mongoose = require("mongoose");

const TaskSchema = new mongoose.Schema({

  userId:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"User"
  },

  title:String,
  startTime:String,
  endTime:String,
  date:String,
  priority:String,

  completed:{
    type:Boolean,
    default:false
  },

  timerLog:[{
    date:Date,
    seconds:Number
  }]

});

module.exports = mongoose.model("Task",TaskSchema);