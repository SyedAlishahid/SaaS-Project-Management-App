const mongoose = require("mongoose");
const Project = require("../Model/project.model.js");
const Workflow = require("../Model/workflow.model.js");

const createProject = async (req, res) => {
  try {
    const { name, description } = req.body;
    const { workspaceId } = req.params;

    if (!name || !description) {
      return res.status(501).json({
        success: false,
        message: "Name and description both required~",
      });
    }

    const findWorkspace = await Workflow.findById(workspaceId);
    if (!findWorkspace) {
      return res.status(501).json({
        success: false,
        message: "Workspace Not found~",
      });
    }

    const isMember = findWorkspace.members.some(
      (member) => member.user?.toString() === req.user._id?.toString(),
    );

    if (!isMember) {
      return res.status(403).json({
        success: false,
        message: "User not found in this workspace",
      });
    }

    const createNewProject = await Project.create({
      name,
      description,
      workspace: findWorkspace._id,
      createdBy: req.user._id,
    });

    return res.status(201).json({
      success: true,
      message: "Project created successfully~",
      project: createNewProject,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
      success: false,
    });
  }
};

const getProject = async (req, res) => {
  try {
    const { projectId } = req.params;

    const findProject = await Project.findById(projectId);

    if (!findProject) {
      return res.status(500).json({
        success: false,
        message: "No project found",
      });
    }

    return res.status(201).json({
      success: true,
      projects: findProject,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
      success: false,
    });
  }
};

const getProjects = async (req, res) => {
  try {
    const { id } = req.params;

    const findWorkspaceAllProjects = await Project.find({
      workspace: id,
    });

    if (!findWorkspaceAllProjects) {
      return res.status(500).json({
        success: false,
        message: "Workspace not found~",
      });
    }

    return res.status(201).json({
      success: true,
      projects: findWorkspaceAllProjects,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
      success: false,
    });
  }
};

const updateProject = async (req, res) => {
  try {
    const { id } = req.params;
    const { newName, newDescription } = req.body;

    if (!newName && !newDescription) {
      return res.status(400).json({
        message: "At least one field is required",
        success: false,
      });
    }

    const update = {};
    if (newName) update.name = newName;
    if (newDescription) update.description = newDescription;

    const project = await Project.findByIdAndUpdate(id, update, { new: true });

    if (!project) {
      return res.status(404).json({
        message: "Project not found",
        success: false,
      });
    }

    return res.status(200).json({
      message: "Project updated",
      data: project,
      success: true,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
      success: false,
    });
  }
};
const deleteProject = async (req, res) => {
  try {
    const { id } = req.params;

    // Find project first
    const findProject = await Project.findById(id);

    if (!findProject) {
      return res.status(404).json({
        message: "Project not found",
        success: false,
      });
    }

    if (findProject.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "Only owner can delete project",
      });
    }

    await Project.findByIdAndDelete(id);

    return res.status(200).json({
      success: true,
      message: "Project deleted successfully",
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
      success: false,
    });
  }
};
module.exports = {
  createProject,
  getProject,
  getProjects,
  deleteProject,
  updateProject,
};
