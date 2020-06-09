const express = require("express"),
	exphbs = require("express-handlebars"),
	session = require("express-session"),
	mongoose = require("mongoose"),
	MongoDBStore = require("connect-mongodb-session")(session),
	passport = require("./config/passport"),
	flash = require("connect-flash"),
	PORT = process.env.PORT || 3000,
	{ MONGODB_URI } = require("./private.json").dev || process.env;

mongoose
	.connect(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true })
	.then((conn) => {
		if (conn) console.log(`Connected to ${conn.connections[0].db.databaseName}`);
	})
	.catch(console.error);

const Store = new MongoDBStore({
	uri: MONGODB_URI,
	collection: "user-sessions"
});
Store.on("error", (error) => console.log(error));

const app = express();
app.use(express.static("public"))
	.use(express.urlencoded({ extended: true }))
	.use(express.json())
	// handlebars stuff
	.engine("handlebars", exphbs({ defaultLayout: "main" }))
	.set("view engine", "handlebars")
	// Session middleware
	.use(
		session({
			secret: process.env.SESS_SECRET || "deku",
			resave: true,
			saveUninitialized: false,
			store: Store
		})
	)
	.use(passport.initialize())
	.use(passport.session())
	// Enable flash messages
	.use(flash())
	.use((req, res, next) => {
		res.locals.successMsg = req.flash("successMsg");
		res.locals.errorMsg = req.flash("errorMsg");
		res.locals.error = req.flash("error");
		next();
	});
// Set routes
require("./routes/router")(app);
require("./routes/user-router")(app);
app.listen(PORT, (error) => {
	if (error) throw error;
	else console.log(`Listening on ${process.env.PORT ? "https://dnd-inventory-web.herokuapp.com/" : `http://localhost:${PORT}`}`);
});
