const express = require("express");
const authRouter = express.Router();
const authController = require("../controllers/authController");
const loginLimiter = require("../middleware/limiters");

authRouter.route("/").post(loginLimiter, authController.login);

authRouter.route("/refresh").get(authController.refresh);

authRouter.route("/logout").post(authController.logout);

module.exports = authRouter;
