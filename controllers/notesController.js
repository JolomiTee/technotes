const User = require("../models/Users");
const Note = require("../models/Note");

const asyncHandler = require("express-async-handler");

const getAllNotes = asyncHandler(async (req, res) => {
	const notes = await Note.find().lean();
	if (!notes?.length) {
		return res.status(400).json({ message: "No notes found" });
	}
	res.json(notes);
});

const createNewnote = asyncHandler(async (req, res) => {
	const { user, title, text } = req.body;
	// check for correct data
	if (!user || !title || !text) {
		return res.status(400).json({ message: "All notes fields are required" });
	}
	// check for duplicates
	const duplicate = await Note.findOne({ title }).lean().exec();

	if (duplicate) {
		return res.status(409).json({ message: "Duplicate note title detected" });
	}

	const noteObject = { title, text, user };

	// Create store new user
	const note = await Note.create(noteObject);

	if (note) {
		res.status(201).json({ message: ` New note: ${title} created` });
	} else {
		res.status(400).json({ message: "Invalid data recieved" });
	}
});

const updateNote = asyncHandler(async (req, res) => {
	const { id, user, title, text, completed } = req.body;

	// Confirm data
	if (!id || !user || !title || !text || typeof completed !== "boolean") {
		return res.status(400).json({ message: "All fields are required" });
	}

	// Does the user exist to update?
	const note = await Note.findById(id).exec();

	if (!note) {
		return res.status(400).json({ message: "Note not found" });
	}

	// Check for duplicate
	const duplicate = await User.findOne({ title }).lean().exec();

	// Allow updates to the original note
	if (duplicate && duplicate?._id.toString() !== id) {
		return res.status(409).json({ message: "Duplicate title found" });
	}

	note.user = user;
	note.title = title;
	note.text = text;
	note.completed = completed;

	const updatedNote = await note.save();

	res.json({ message: `${updatedNote.title} updated` });
});

const deleteNote = asyncHandler(async (req, res) => {
	const { id } = req.body;

	// Confirm data
	if (!id) {
		return res.status(400).json({ message: "Note ID required" });
	}

	// Confirm note exists to delete
	const note = await Note.findById(id).exec();

	if (!note) {
		return res.status(400).json({ message: "Note not found" });
	}

	const result = await note.deleteOne();

	const reply = `Note '${result.title}' with ID ${result._id} deleted`;

	res.json(reply);
});

module.exports = { getAllNotes, createNewnote, updateNote, deleteNote };
