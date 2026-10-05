const router = require("express").Router();
const { VerifyJWT } = require("../Middleware/auth.middleware.js");
const {
  createProject,
  getProject,
  deleteProject,
  updateProject,
} = require("../Controller/project.controller.js");

router.post("/create/:workspaceId", VerifyJWT, createProject);
router.get("/all/:workspaceId/", VerifyJWT, getProject);
router.patch("/update/:id", VerifyJWT, updateProject);
router.delete("/delete/:id", VerifyJWT, deleteProject);
module.exports = router;
