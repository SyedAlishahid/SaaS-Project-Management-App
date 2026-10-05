const router = require("express").Router();
const {
  createWorkflow,
  getMyWorkspace,
  getWorkspace,
  deleteWorkspace,
  addMembers,
  removeMember,
  updateMemberRole,
} = require("../Controller/workflow.controller.js");

const { VerifyJWT } = require("../Middleware/auth.middleware.js");

router.post("/create-workspace", VerifyJWT, createWorkflow);

router.get("/my-workspace", VerifyJWT, getMyWorkspace);

router.get("/get-workspace/:id", VerifyJWT, getWorkspace);

router.delete("/delete-workspace/:id", VerifyJWT, deleteWorkspace);

router.post("/add-member/:id", VerifyJWT, addMembers);

router.delete("/remove-member/:id/:userId", VerifyJWT, removeMember);

router.patch("/update-role/:id/:userId", VerifyJWT, updateMemberRole);

module.exports = router;
