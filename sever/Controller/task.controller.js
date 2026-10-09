const mongoose = require("mongoose");
const Task = require("../Model/task.model.js");
const Project = require("../Model/project.model.js");
const User = require("../Model/user.model.js");

const createTask = async (req, res) => {
  try {
    const {
      name,
      description,
      Project,
      assignedTo,
      status,
      priority,
      deadline,
    } = req.body;

    if (
      !name &&
      !description &&
      !Project &&
      !assignedTo &&
      !priority &&
      !deadline &&
      !status
    ) {
      return res.status(501).json({
        success: false,
        message: "Both fields required~",
      });
    }
    const task = await Task.create({
      name,
      description,
      Project,
      assignedTo,
      priority,
      deadline,
      status,
      createdBy: req.user._id,
    });

    res.status(201).json({
      success: true,
      task: task,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
      success: false,
    });
  }
};

// const getTasks = async (req, res) => {
//   try {
//     const { projectId } = req.params;

//     const ProjectInfo = await Project.findById(projectId);
//     if (!ProjectInfo) {
//       return res.status(500).json({
//         success: false,
//         message: "Project not found~",
//       });
//     }

//   } catch (error) {
//     return res.status(500).json({
//       message: error.message,
//       success: false,
//     });
//   }
// };

const getTask = async (req, res) => {
  try {
    const { id } = req.params;

    const taskInfo = await Task.findById(id);
    if (!taskInfo) {
      return res.status(500).json({
        success: false,
        message: "task not found~",
      });
    }

    return res.status(200).json({
      success: true,
      Task: taskInfo,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
      success: false,
    });
  }
};

const updateStatus = async (req, res) => {
  try {
    const { id } = req.params;

    const { newStatus } = req.body;

    const updateStatue = await Task.findByIdAndUpdate(
      id,
      {
        status: newStatus,
      },
      { new: true },
    );

    if (!updateStatue) {
      return res.status(500).json({
        message: "Cant update tryAgain later",
        success: false,
      });
    }

    return res.status(200).json({
      message: "Status updated successfully~",
      Updated_Task: updateStatue,
      success: true,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
      success: false,
    });
  }
};

const assignTask = async (req, res) => {
  try {
    const { id } = req.params;

    const { newUser } = req.body;

    const updateTask = await Task.findByIdAndUpdate(
      id,
      {
        assignedTo: newUser,
      },
      { new: true },
    );

    if (!updateTask) {
      return res.status(500).json({
        message: "Cant update tryAgain later",
        success: false,
      });
    }

    return res.status(200).json({
      message: "Status updated successfully~",
      Updated_Task: updateTask,
      success: true,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
      success: false,
    });
  }
};

const updateTask = async (req, res) => {
  try {
    const { id } = req.params;
    const { newname, newdescription, newpriority, newdeadline } = req.body;

    if (!newname || !newdescription || !newpriority || !newdeadline) {
      return res.status(400).json({
        message: "At least one field is required",
        success: false,
      });
    }

    const update = {};
    if (newname) update.name = newname;
    if (newdescription) update.description = newdescription;
    if (newpriority) update.priority = newpriority;
    if (newdeadline) update.deadline = newdeadline;

    const updateTask = await Task.findByIdAndUpdate(id, update, { new: true });
    return res.status(200).json({
      success: true,
      Updated_Task: updateTask,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
      success: false,
    });
  }
};

const deleteTask = async (req, res) => {
  try {
    const { id } = req.params;

    const deleteTaske = await Task.findByIdAndDelete(id);

    if (!deleteTaske) {
      return res.status(500).json({
        message: "Cant delete Task! try again",
        success: false,
      });
    }

    return res.status(200).json({
      success: true,
      message: "Task deleted Successfully~",
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
      success: false,
    });
  }
};

module.exports = {
  createTask,
  getTask,
  updateStatus,
  updateTask,
  deleteTask,
  assignTask,
};
