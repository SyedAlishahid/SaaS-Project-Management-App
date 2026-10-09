const { verify } = require("jsonwebtoken");
const {
  createTask,
  getTask,
  updateStatus,
  updateTask,
  deleteTask,
  assignTask,
} = require("../Controller/task.controller.js");
const { VerifyJWT } = require("../Middleware/auth.middleware.js");

const router = require("express").Router();

router.post("/create", VerifyJWT, createTask);

router.get("/:id", VerifyJWT, getTask);

router.patch("/update/:id", VerifyJWT, updateTask);

router.delete("/delete/:id", VerifyJWT, deleteTask);

router.patch("/:id/assign", VerifyJWT, assignTask);

module.exports = router;
