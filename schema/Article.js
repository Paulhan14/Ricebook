const mongoose = require("mongoose");
const { Schema } = mongoose;

var commentSchema = new Schema({
	commentId: Number,
	author: String,
	date: Date,
	avatar: String,
	text: String,
});

const articleSchema = new Schema({
	id: Number,
	author: String,
	avatar: String,
	img: String,
	date: Date,
	text: String,
	comments: [String],
});

// create a new collection called 'users'
mongoose.model("articles", articleSchema);
mongoose.model("comments", commentSchema);
