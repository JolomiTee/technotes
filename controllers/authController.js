const User = require("../models/Users");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const asyncHandler = require("express-async-handler");

// @desc Login
// @route POST /auth
// @access Public
const login = asyncHandler(async (req, res) => {
	const { username, password } = req.body;

	if (!username || !password) {
		return res.status(400).json({ message: "All fields are required" });
	}
	const foundUser = await User.findOne({ username }).exec();
	if (!foundUser || !foundUser.active) {
		return res.status(401).json({ message: "Unauthorized" });
	}

	const match = await bcrypt.compare(password, foundUser.password);

	if (!match) return res.status(401).json({ message: "Unauthorized" });

	const accessToken = jwt.sign(
		{
			UserInfo: {
				username: foundUser.username,
				roles: foundUser.roles,
			},
		},
		process.env.ACCESS_TOKEN_SECRET,
		{
			expiresIn: "10m",
		}
	);

	const refreshToken = jwt.sign(
		{
			username: foundUser.username,
		},
		process.env.REFRESH_TOKEN_SECRET,
		{
			expiresIn: "10m",
		}
	);

	res.cookie("jwt", refreshToken, {
		httpOnly: true,
		secure: true,
		sameSite: "None",
		maxAge: 7 * 24 * 60 * 60 * 1000,
	});

	res.json({ accessToken });
});

// @desc Refresh
// @route: /auth/refresh
// @access: Public
const refresh = (req, res) => {
	const cookies = req.cookies;

	if (!cookies?.jwt)
		return res.status(401).json({ message: "Unauthorized, no cookies" });

	const refreshToken = cookies.jwt;

	jwt.verify(
		refreshToken,
		process.env.REFRESH_TOKEN_SECRET,
		asyncHandler(async (err, decoded) => {
			if (err)
				return res
					.status(403)
					.json({ message: "Forbidden, there is a problem", error: err });

			const foundUser = await User.findOne({ username: decoded.username });

			if (!foundUser)
				return res.status(401).json({ message: "Unauthorized, no such user" });

			const accessToken = jwt.sign(
				{
					UserInfo: {
						username: foundUser.username,
						roles: foundUser.roles,
					},
				},
				process.env.ACCESS_TOKEN_SECRET,
				{ expiresIn: "10m" }
			);

			res.json({ accessToken });
		})
	);
};

// @desc: logout
// @route: POST
// @access: Public
const logout = (req, res) => {
	const cookies = req.cookies;
	if (!cookies?.jwt) return res.sendStatus(204); //No content
	res.clearCookie("jwt", { httpOnly: true, sameSite: "None", secure: true });
	res.json({ message: "Cookie cleared" });
};

module.exports = { login, refresh, logout };
