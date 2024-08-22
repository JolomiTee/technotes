const express = require("express");
const authRouter = express.Router();
const authController = require("../controllers/authController");
const loginLimiter = require("../middleware/limiters");

authRouter.route("/").post(loginLimiter);

authRouter.route("/refresh").get();

authRouter.route("/logout").post();

module.exports = authRouter;
