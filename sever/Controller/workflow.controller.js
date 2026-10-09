const mongoose = require("mongoose");
const Workflow = require("../Model/workflow.model.js");
const User = require("../Model/user.model.js");

const createWorkflow = async (req, res) => {
  try {
    const { name } = req.body;

    const owner = req.user._id;

    const createWF = await Workflow.create({
      name,
      owner: owner,
      member: [
        {
          user: owner,
          role: "Owner",
        },
      ],
    });

    return res.status(201).json({
      success: true,
      message: "Workflow Created Successfully~",
      Workflow: createWF,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const getMyWorkspace = async (req, res) => {
  try {
    const owner = req.user._id;

    const findWorkflow = await Workflow.find({ owner: owner });
    if (!findWorkflow) {
      return res.status(500).json({
        success: false,
        message: "No workspace found~",
      });
    }

    return res.status(201).json({
      success: true,
      workspaces: findWorkflow,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const getWorkspace = async (req, res) => {
  try {
    const { id } = req.params;

    const find_Wf = await Workflow.findById(id);

    if (!find_Wf) {
      return res.status(500).json({
        success: false,
        message: "No Workspace found~",
      });
    }
    res.status(200).json({
      success: true,
      workSpace: find_Wf,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const deleteWorkspace = async (req, res) => {
  try {
    const { id } = req.params;

    const deleteWf = await Workflow.findOneAndDelete({ _id: id });
    if (!deleteWf) {
      return res.status(500).json({
        success: false,
        message: "Cant delete. Please try again later!",
      });
    }
    res.status(200).json({
      success: true,
      message: "Workspace Deleted Successfully~",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const addMembers = async (req, res) => {
  try {
    const { id } = req.params;
    const { email, role } = req.body;

    // 1. Find workspace
    const workspace = await Workflow.findById(id);

    if (!workspace) {
      return res.status(404).json({
        success: false,
        message: "Workspace not found",
      });
    }

    // 2. Find user by email
    const findUser = await User.findOne({ email });

    if (!findUser) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // 3. Check if user is already a member
    const alreadyMember = workspace.members.some(
      (member) => member.user.toString() === findUser._id.toString(),
    );

    if (alreadyMember) {
      return res.status(409).json({
        success: false,
        message: "User is already in this team",
      });
    }

    // 4. Add user to workspace
    const adding_User = await Workflow.findByIdAndUpdate(
      id,
      {
        $push: {
          members: {
            user: findUser._id,
            role: role || "member",
          },
        },
      },
      { new: true },
    );

    return res.status(200).json({
      success: true,
      message: "New member added successfully",
      members: adding_User.members,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const removeMember = async (req, res) => {
  try {
    const { id, userId } = req.params;

    const workspace = await Workflow.findById(id);
    if (!workspace) {
      return res.status(500).json({
        success: false,
        message: "Workspace not found~",
      });
    }

    const findUser = await User.findById(userId);
    if (!findUser) {
      return res.status(500).json({
        success: false,
        message: "User not found~",
      });
    }

    const requesterRole = workspace.members.find(
      (m) => m.user.toString() === req.user._id.toString(),
    )?.role;

    if (requesterRole === "member") {
      return res.status(403).json({
        success: false,
        message: "Members cannot remove other members",
      });
    }

    // Can't remove the owner
    if (workspace.owner.toString() === userId) {
      return res.status(400).json({
        success: false,
        message: "Cannot remove the owner",
      });
    }

    await Workflow.findByIdAndUpdate(
      id,
      {
        $pull: {
          members: {
            user: findUser._id,
          },
        },
      },
      { new: true },
    );
    return res.status(200).json({
      success: true,
      message: "Member removed successfully~",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const updateMemberRole = async (req, res) => {
  try {
    const { id, userId } = req.params;
    const { newRole } = req.body;
    const workspace = await Workflow.findById(id);
    if (!workspace) {
      return res.status(500).json({
        success: false,
        message: "Workspace not found~",
      });
    }

    const findUser = await User.findById(userId);
    if (!findUser) {
      return res.status(500).json({
        success: false,
        message: "User not found~",
      });
    }

    const requesterRole = workspace.members.find(
      (m) => m.user?.toString() === req.user._id?.toString(),
    )?.role;

    if (requesterRole === "member") {
      return res.status(403).json({
        success: false,
        message: "Member cannot change |Role|",
      });
    }

    const updatedRole = await Workflow.findOneAndUpdate(
      { _id: id, "members.user": userId },
      {
        $set: {
          "members.$.role": newRole,
        },
      },
      { new: true },
    );

    return res.status(201).json({
      success: true,
      message: "Role updated successfully~",
      updated_User: updatedRole,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  createWorkflow,
  getMyWorkspace,
  getWorkspace,
  deleteWorkspace,
  addMembers,
  removeMember,
  updateMemberRole,
};
