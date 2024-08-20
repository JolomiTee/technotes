const express = require("express");
const userRouter = express.Router();
const usersController = require("../controllers/usersController");

userRouter
	.route("/")
	.get(usersController.getAllUsers)
	.post(usersController.createNewUser)
	.patch(usersController.updateUser)
	.delete(usersController.deleteUser);

module.exports = userRouter;
