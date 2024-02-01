const cookieParser = require("cookie-parser");
const express = require("express");
const mongoose = require("mongoose");
// const cors = require("cors");

const session = require("express-session");
const passport = require("passport");
require("passport-google-oauth").OAuth2Strategy;

// const clientUrl = "https://final-ricebookserver-jh135.herokuapp.com/";
// const clientUrl = "http://localhost:3000";
// fontend origin
// const corsOptions = {
// 	origin: `${clientUrl}`,
// 	credentials: true,
// 	exposedHeaders: ["set-cookie"],
// };

require("./schema/User");
require("./schema/Article");
require("./schema/Profile");

mongoose
	.connect(
		`mongodb+srv://dbAdmin:${encodeURIComponent(
			process.env.MONGODB_ADMIN_PASSWORD
		)}@cluster0.vkbul.mongodb.net/?retryWrites=true&w=majority`
	)
	.then((res) => console.log("Connected to DB"))
	.catch((err) => console.log(err));

require("./services/passport");

const app = express();
app.use(express.json());
app.use(cookieParser());
// app.use(cors(corsOptions));
app.use(
	session({
		secret: "doNotGuessTheSecret",
		resave: true,
		saveUninitialized: true,
	})
);
app.use(passport.initialize());
app.use(passport.session());
require("./routes/authRoutes")(app);
require("./routes/profileRoutes")(app);
require("./routes/followingRoutes")(app);
require("./routes/articleRoutes")(app);

if (process.env.NODE_ENV === "production") {
	app.use(express.static("frontend/build/"));
	const path = require("path");
	app.get("*", (req, res) => {
		res.sendFile(path.resolve(__dirname, "frontend", "build", "index.html"));
	});
}

// Get the port from the environment, i.e., Heroku sets it
const port = process.env.PORT || 4200;
const server = app.listen(port, () => {
	const addr = server.address();
	console.log(`Server listening at http://${addr.address}:${addr.port}`);
});
