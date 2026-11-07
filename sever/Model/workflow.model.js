const mongoose = require("mongoose");

const workflowSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
      unique: true,
    },

    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
    },

    members: [
      {
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
          required: true,
        },
        role: {
          type: String,
          enum: ["admin", "member"],
          default: "member",
        },
        name: { type: String, required: true },
        email: { type: String, required: true },
        isVerified: { type: Boolean, required: true },
        profile: { type: String, required: true },
        bio: { type: String, required: true },
      },
    ],
  },
  { timestamps: true },
);
const Workflow = mongoose.model("Workflow", workflowSchema);

module.exports = Workflow;
