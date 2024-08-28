require("dotenv").config();
require("express-async-errors");
const express = require("express");
const app = express();
const path = require("path");
const PORT = process.env.PORT || 3500;
const { logger, logEvents } = require("./middleware/logger");
const errorHandler = require("./middleware/errorHandler");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const corsOptions = require("./config/corsOptions");
const connectDB = require("./config/dbConnect");
const mongoose = require("mongoose");
const userRouter = require("./routes/userRoutes");
const noteRouter = require("./routes/noteRoute");
const authRouter = require("./routes/authRoute");

// Connect to MongoDB
connectDB();

// ************* MIDDLEWARES *************

app.use(logger);
app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser());
app.use("/", express.static(path.join(__dirname, "/public")));

// ************* APP  *************

app.use("/", require("./routes/root"));
app.use("/users", userRouter);
app.use("/notes", noteRouter);
app.use("/auth", authRouter);

app.all("*", (req, res) => {
	res.status(404);
	if (req.accepts("html")) {
		res.sendFile(path.join(__dirname, "views", "404.html"));
	} else if (req.accepts("json")) {
		res.json({ message: "404 not found" });
	} else {
		res.type("text").send("404 not found");
		1;
	}
});

app.use(errorHandler);

mongoose.connection.once("open", () => {
	app.listen(PORT, () => console.log(`server running on ${PORT}`));
	console.log("Connected to MongoDB");
});

mongoose.connection.on("error", (err) => {
	console.log(err);
	logEvents(
		`${err.no}: ${err.code}\t${err.syscall}\t${err.hostname}`,
		"mongoErrLog.log"
	);
});
