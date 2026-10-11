const Comment = require("../Model/comments.model.js");
const Task = require("../Model/task.model.js");

const addComment = async (req, res) => {
  try {
    const { comment } = req.body;

    const { id } = req.params;

    const findTask = await Task.findById(id);

    if (!findTask) {
      return res.status(500).json({
        message: "Task not found~",
        success: false,
      });
    }

    const createComment = await Comment.create({
      task: findTask._id,
      user: req.user._id,
      text: comment,
    });

    return res.status(200).json({
      success: true,
      comment: createComment,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
      success: false,
    });
  }
};

const getComments = async (req, res) => {
  try {
    const { id } = req.params;

    const comments = await Comment.find({ task: id });
    if (!comments) {
      return res.status(500).json({
        success: false,
        message: "No comment find~",
      });
    }

    return res.status(200).json({
      success: true,
      count: comments.length,
      comments,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
      success: false,
    });
  }
};

const deleteComment = async (req, res) => {
  try {
    const { id } = req.params;

    const deleteComment = await Comment.findByIdAndDelete(id);

    if (!deleteComment) {
      return res.status(500).json({
        success: 500,
        message: "can't delete Comment~",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Comment deleted",
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
      success: false,
    });
  }
};

module.exports = { addComment, getComments, deleteComment };
