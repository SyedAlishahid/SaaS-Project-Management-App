const router = require("express").Router();

const {
  addComment,
  getComments,
  deleteComment,
} = require("../Controller/comment.controller.js");
const { VerifyJWT } = require("../Middleware/auth.middleware.js");

router.post("/:id/comments", VerifyJWT, addComment);

router.get("/:id/comments", VerifyJWT, getComments);
router.delete("/comments/:id", VerifyJWT, deleteComment);

// router.delete("/comment/:id", VerifyJWT, deleteComment);

module.exports = router;
