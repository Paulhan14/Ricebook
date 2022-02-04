const mongoose = require("mongoose");
const { Schema } = mongoose;

const followingSchema = new Schema({
	username: String,
	headline: String,
	avatar: String,
});

const profileSchema = new Schema({
	username: String,
	displayname: String,
	phone: String,
	email: String,
	zipcode: String,
	dob: Date,
	headline: String,
	avatar: String,
	following: [followingSchema],
});

mongoose.model("profiles", profileSchema);
