const Workflow = require("../Model/workflow.model.js");
const Project = require("../Model/project.model.js");
const Task = require("../Model/task.model.js");

const getStats = async (req, res) => {
  try {
    const { id } = req.params;

    const findProject = await Project.findById(id); // fixed: pass id directly
    console.log(findProject);
    if (!findProject) {
      return res.status(404).json({
        // fixed: 404 not 500
        success: false,
        message: "workflow not found~",
      });
    }

    // fixed: find() instead of findById(), so .length works
    const findTasks = await Task.find({ Project: findProject._id });

    const CompletedTasks = await Task.find({
      Project: findProject._id,
      status: "Completed",
    });

    const pendingTasks = await Task.find({
      Project: findProject._id,
      status: "Pending",
    });

    const highprior = await Task.find({
      Project: findProject._id,
      priority: "high",
    });

    const medprior = await Task.find({
      Project: findProject._id,
      priority: "medium",
    });

    const lowprior = await Task.find({
      Project: findProject._id,
      priority: "low",
    });

    const overdueTasks = await Task.countDocuments({
      Project: findProject._id, // fixed: filter by this project
      deadline: { $lt: new Date() },
      status: { $ne: "Completed" }, // fixed: "Done" -> "Completed" to match the rest
    });

    return res.status(200).json({
      success: true,
      stats: {
        Tasks: findTasks.length,
        Completed: CompletedTasks.length,
        Pendings: pendingTasks.length, // fixed: .length
        tasksByPriority: {
          high: highprior.length, // fixed: .length
          medium: medprior.length,
          low: lowprior.length,
        },
        overdue_Tasks: overdueTasks,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = { getStats };
