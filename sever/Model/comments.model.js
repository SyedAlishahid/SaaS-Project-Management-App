const mongoose = require("mongoose");

const commentSchema = mongoose.Schema({
  task: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Task",
    required: true,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  text: {
    type: String,
    required: true,
    lowercase: true,
    trim: true,
  },
});
const Comment = mongoose.model("Comment", commentSchema);

module.exports = Comment;
