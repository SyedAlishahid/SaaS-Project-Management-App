const mongoose = require("mongoose");
const Project = require("./project.model");

const taskSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
    },

    description: {
      type: String,
      required: true,
      lowercase: true,
    },

    Project: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Project",
    },
    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    status: {
      type: String,
      enum: ["Pending", "Todo", "Completed"],
      default: "Pending",
    },

    priority: {
      type: String,
      enum: ["low", "medium", "High"],
      default: "medium",
    },

    deadline: {
      type: Date,
      required: true,
    },

    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true },
);

const Task = mongoose.model("Task", taskSchema);

module.exports = Task;
