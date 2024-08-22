const rateLimit = require("express-rate-limit");

const { logEvents } = require("./logger");

const loginLimiter = rateLimit({
	windowMs: 60 * 1000,
	max: 5,
	message: {
		message: "Too many login attempts, try again later",
	},
	handler: (req, res, next, option) => {
		logEvents(
			`Too many requests: ${options.message.message}\t${req.method}\t${req.url}\t${req.headers.origin}`,
			"errr.log"
		);
	},
	standardHeaders: true,
	legacyHeaders: false,
});

module.exports = loginLimiter;
