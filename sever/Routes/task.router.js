const {
  createTask,
  getTask,
  getTasks,
  updateStatus,
  updateTask,
  deleteTask,
  assignTask,
} = require("../Controller/task.controller.js");
const { VerifyJWT } = require("../Middleware/auth.middleware.js");
const router = require("express").Router();

router.post("/create", VerifyJWT, createTask);

router.get("/:id", VerifyJWT, getTask);

router.get("/projects/:id/tasks", VerifyJWT, getTasks);

router.patch("/update/:id", VerifyJWT, updateTask);

router.delete("/delete/:id", VerifyJWT, deleteTask);

router.patch("/:id/assign", VerifyJWT, assignTask);

module.exports = router;
