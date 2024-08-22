const express = require("express");
const userRouter = express.Router();
const usersController = require("../controllers/usersController");
const verifyJWT = require("../middleware/verifyJwt");

userRouter.use(verifyJWT);

userRouter
	.route("/")
	.get(usersController.getAllUsers)
	.post(usersController.createNewUser)
	.patch(usersController.updateUser)
	.delete(usersController.deleteUser);

module.exports = userRouter;
