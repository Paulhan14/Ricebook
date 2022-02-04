const cookieParser = require("cookie-parser");
const express = require("express");
const mongoose = require("mongoose");
const cors = require('cors');

const session = require('express-session');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;

const clientUrl = "http://ruthless-jail.surge.sh";
// const clientUrl = "http://localhost:3000";
// fontend origin
const corsOptions = {origin: `${clientUrl}`, credentials: true, exposedHeaders: ['set-cookie']};

require("./schema/User");
require("./schema/Article");
require("./schema/Profile");

const connectionString =
	"mongodb+srv://dbAdmin:4Z3fRvQAT%40MH%7E%23%23@cluster0.vkbul.mongodb.net/ricebookDB?retryWrites=true&w=majority";

mongoose
	.connect(connectionString)
	.then((res) => console.log("Connected to DB"))
	.catch((err) => console.log(err));

	require('./services/passport');

const app = express();  
app.use(express.json());
app.use(cookieParser());
app.use(cors(corsOptions));
app.use(session({
    secret: 'doNotGuessTheSecret',
    resave: true,
    saveUninitialized: true
}));
app.use(passport.initialize());
app.use(passport.session());
require("./routes/authRoutes")(app);
require("./routes/profileRoutes")(app);
require("./routes/followingRoutes")(app);
require("./routes/articleRoutes")(app);

// Get the port from the environment, i.e., Heroku sets it
const port = process.env.PORT || 4200;
const server = app.listen(port, () => {
	const addr = server.address();
	console.log(`Server listening at http://${addr.address}:${addr.port}`);
});
