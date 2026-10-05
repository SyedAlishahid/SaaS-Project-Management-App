const mongoose = require("mongoose");

const commentSchema = mongoose.Schema({
  task: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Task",
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
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
