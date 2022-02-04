const mongoose = require("mongoose");
const multer = require("multer");
const uploadImage = require("../uploadCloudinary");
const Article = mongoose.model("articles");
const Comment = mongoose.model("comments");
const Profile = mongoose.model("profiles");

/**
 *
 * @param {*} req
 * @param {*} res
 */
const getArticles = async (req, res) => {
	let username = req.user.username;

	let filter = {};

	let id = req.params.id;

	if (id) {
		if (id.match(/^[a-zA-Z]{1}[a-zA-Z0-9]*$/)) {
			// this is a user name
			filter["author"] = id;
		} else {
			// this is a post id
			filter["_id"] = id;
		}
	} else {
		// need to know the follower id
		const userProfile = await Profile.findOne({
			username: username,
		}).exec();
		let followingNames = userProfile.following.map((fol) => fol.username);
		filter["author"] = {
			$in: [...followingNames, username],
		};
	}

	try {
		const articles = await Article.find(filter).sort({ date: -1 }).exec();

		let msg = { articles: articles };
		return res.status(200).send(msg);
	} catch (err) {
		return res.status(500).send("Internal server error");
	}
};

/**
 *
 * @param {*} req
 * @param {*} res
 */
const updateArticle = async (req, res) => {
	let username = req.user.username;
	let id = req.params.id;

	if (!id) {
		res.status(400).send("Bad input");
		return;
	}

	// get the article first, then update

	let filter = { _id: id };

	try {
		const articleToUpdate = await Article.findOne(filter).exec();
		let update = {};

		

		if (req.body.commentId) {
			if (Number(req.body.commentId) === -1) {
				const authorObj = await Profile.findOne({ username: username }).exec();

				let newComment = {
					author: username,
					date: new Date().getTime(),
					avatar: authorObj.avatar,
					text: req.body.text,
				};
				const addedComment = await new Comment(newComment).save();
				update["comments"] = [
					...articleToUpdate.comments,
					addedComment._id,
				];
			} else {
				const commentToUpdate = await Comment.findOne({
					_id: req.body.commentId,
				}).exec();
				// Forbidden if the user does not own the comment.
				if (commentToUpdate.author !== username) {
					res.status(401).send("Unauthorized.");
					return;
				}
				await Comment.findOneAndUpdate(
					{ _id: req.body.commentId },
					{ text: req.body.text }
				).exec();
			}
		} else {
			// Forbidden if the user does not own the article.
			if (articleToUpdate.author !== username) {
				res.status(401).send("Unauthorized.");
				return;
			}
			update["text"] = req.body.text;
		}

		// update the article
		let updated = await Article.findOneAndUpdate(filter, update, {
			new: true,
		}).exec();
		let msg = { articles: [updated] };
		res.status(200).send(msg);
		return;
	} catch (err) {
		res.status(500).send("Internal server error");
		return;
	}
};

/**
 *
 * @param {*} req
 * @param {*} res
 */
const addArticle = async (req, res) => {
	let username = req.user.username;
	let text = req.body.text;
	const imgUrl = req.fileurl;

	if (!text) {
		res.status(400).send("Bad input");
		return;
	}

	let user = await Profile.findOne({ username: username }).exec();

	// push a new article
	const newArticle = await new Article({
		author: username,
		avatar: user.avatar,
		img: imgUrl ? imgUrl : "",
		date: new Date().getTime(),
		text: text,
		comments: [],
	}).save();

	// get every article of this user
	const articles = await Article.find({ author: username }).exec();
	let msg = { articles: articles };
	res.status(200).send(msg);
	return;
};

const getComment = async (req, res) => {
	let username = req.user.username;

	let id = req.params.id;

	if (!id) {
		res.status(400).send("Bad input");
		return;
	}

	try {
		// find the article comments id
		const article = await Article.findOne({ _id: id }).exec();

		let commentFilter = {
			_id: {
				$in: article.comments,
			},
		};
		// query the comments
		const comments = await Comment.find(commentFilter).exec();

		let msg = { comments: comments };
		return res.status(200).send(msg);
	} catch (err) {
		return res.status(500).send("Internal server error");
	}
};

module.exports = (app) => {
	app.get("/articles/:id?", getArticles);
	app.get("/comment/:id", getComment);
	app.put("/articles/:id", updateArticle);
	app.post("/article", uploadImage("articles"), addArticle);
};
