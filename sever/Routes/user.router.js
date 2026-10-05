const router = require("express").Router();
const {
  signUp,
  login,
  logout,
  userDetails,
} = require("../Controller/user.controller.js");
const { VerifyJWT } = require("../Middleware/auth.middleware.js");
const upload = require("../multer/multer.js");

router.post(
  "/sign-up",
  upload.fields([{ name: "profile", maxCount: 1 }]),
  signUp,
);

router.post("/login", login);

router.post("/logout", VerifyJWT, logout);

router.get("/user", VerifyJWT, userDetails);

module.exports = router;
