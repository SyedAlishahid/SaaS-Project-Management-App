const { getStats } = require("../Controller/dashboard.controller.js");
const router = require("express").Router();
const { VerifyJWT } = require("../Middleware/auth.middleware.js");

router.get("/:id", VerifyJWT, getStats);

module.exports = router;
