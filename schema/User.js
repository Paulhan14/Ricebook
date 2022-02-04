const mongoose = require("mongoose");
const { Schema } = mongoose;

const multiSchema = new Schema({
	source: String,
	username: String,
});

const userSchema = new Schema({
	username: String,
	salt: String,
	hash: String,
	googleId: String,
	auth: [multiSchema],
});

// create a new collection called 'users'
mongoose.model("users", userSchema);
