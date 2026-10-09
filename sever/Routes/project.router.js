const router = require("express").Router();
const { VerifyJWT } = require("../Middleware/auth.middleware.js");
const {
  createProject,
  getProject,
  getProjects,
  deleteProject,
  updateProject,
} = require("../Controller/project.controller.js");

router.post("/create/:workspaceId", VerifyJWT, createProject);
router.get("/:projectId/", VerifyJWT, getProject);
router.get("/workspace/:id/projects/", VerifyJWT, getProjects);

router.patch("/update/:id", VerifyJWT, updateProject);
router.delete("/delete/:id", VerifyJWT, deleteProject);
module.exports = router;
