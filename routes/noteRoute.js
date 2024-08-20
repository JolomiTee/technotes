const express = require("express");
const noteRouter = express.Router();
const notesController = require("../controllers/notesController");

noteRouter
	.route("/")
	.get(notesController.getAllNotes)
	.post(notesController.createNewnote)
	.patch(notesController.updateNote)
	.delete(notesController.deleteNote);

module.exports = noteRouter;
