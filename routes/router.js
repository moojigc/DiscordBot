const { Guild, Player } = require("../models"),
	isEqual = require("lodash/isEqual"),
	serverError = (res, error) => {
		res.json({ redirectURL: "/server-error" });
		console.trace(error);
	},
	userStatus = (req) => {
		return {
			loggedOut: req.user ? false : true,
			loggedIn: req.user ? true : false
		};
	};

module.exports = (app) => {
	// Renders the bot Guide
	app.get("/", async (req, res) => {
		try {
			res.render("guide", { userStatus: userStatus(req) });
		} catch (error) {
			serverError(res, error);
		}
	});

	// Returns player data in JSON format
	app.get("/api/guilds", async (req, res) => {
		try {
			let player = await Guild.find({}).populate("players");
			console.log(player);
			res.status(200).json(player).end();
		} catch (error) {
			serverError(res, error);
		}
	});

	app.get("/register", (req, res) => {
		res.render("register");
	});

	app.get("/login", (req, res) => {
		if (req.user) {
			res.redirect("/inventory");
		} else {
			res.render("login", { userStatus: userStatus(req) });
		}
	});
	app.get("/server-error", (req, res) => {
		res.render("server-error", { userStatus: userStatus(req) });
	});
	app.get("/add-character", (req, res) => {
		res.render("add-character", { userStatus: userStatus(req) });
	});
};