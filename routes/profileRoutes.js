const mongoose = require("mongoose");
const Profile = mongoose.model("profiles");
const Article = mongoose.model("articles");
const Comment = mongoose.model("comments");
const uploadImage = require("../uploadCloudinary");

/**
 * get profile of user.
 * @param {*} req
 * @param {*} res
 */
const getProfile = async (req, res) => {
	let username = req.params.user;

	// extract loggedin user from session
	if (username === undefined) {
		username = req.user.username;
	}
	try {
		const profile = await Profile.findOne({ username: username }).exec();

		if (profile === null) {
			res.status(404).send("User not found");
			return;
		}

		res.status(200).send(profile);
		return;
	} catch (err) {
		return res.status(500).send("Internal server error");
	}
};

/**
 * get and set display name.
 * @param {*} req
 * @param {*} res
 */
const getDisplayName = async (req, res) => {
	let username = req.params.user;

	// extract loggedin user from session
	if (username === undefined) {
		username = req.user.username;
	}
	try {
		const profile = await Profile.findOne({ username: username }).exec();

		if (profile === null) {
			res.status(404).send("User not found");
			return;
		}

		let msg = { username: username, displayname: profile.displayname };
		res.status(200).send(msg);
		return;
	} catch (err) {
		return res.status(500).send("Internal server error");
	}
};

const putDisplayName = async (req, res) => {
	let username = req.user.username;
	const displayname = req.body.displayname;

	if (!displayname) {
		res.status(400).send("Bad input");
		return;
	}
	try {
		const updatedProfile = await Profile.findOneAndUpdate(
			{ username: username },
			{ displayname: displayname },
			{ new: true }
		).exec();

		if (updatedProfile === null) {
			res.status(404).send("User not found");
			return;
		}

		let msg = {
			username: username,
			displayname: updatedProfile.displayname,
		};
		res.status(200).send(msg);
		return;
	} catch (err) {
		return res.status(500).send("Internal server error");
	}
};

/**
 * get and set display name.
 * @param {*} req
 * @param {*} res
 */
const getPhoneNumber = async (req, res) => {
	let username = req.params.user;

	// extract loggedin user from session
	if (username === undefined) {
		username = req.user.username;
	}
	try {
		const profile = await Profile.findOne({ username: username }).exec();

		if (profile === null) {
			res.status(404).send("User not found");
			return;
		}

		let msg = { username: username, phone: profile.phone };
		res.status(200).send(msg);
		return;
	} catch (err) {
		return res.status(500).send("Internal server error");
	}
};

const putPhoneNumber = async (req, res) => {
	let username = req.user.username;
	const phone = req.body.phone;

	if (!phone) {
		res.status(400).send("Bad input");
		return;
	}
	try {
		const updatedProfile = await Profile.findOneAndUpdate(
			{ username: username },
			{ phone: phone },
			{ new: true }
		).exec();

		if (updatedProfile === null) {
			res.status(404).send("User not found");
			return;
		}

		let msg = { username: username, phone: updatedProfile.phone };
		res.status(200).send(msg);
		return;
	} catch (err) {
		return res.status(500).send("Internal server error");
	}
};

/**
 * get and set headline.
 * @param {*} req
 * @param {*} res
 */
const getHeadline = async (req, res) => {
	let username = req.params.user;

	// extract loggedin user from session
	if (username === undefined) {
		username = req.user.username;
	}
	try {
		const profile = await Profile.findOne({ username: username }).exec();

		if (profile === null) {
			res.status(404).send("User not found");
			return;
		}

		let msg = { username: username, headline: profile.headline };
		res.status(200).send(msg);
		return;
	} catch (err) {
		return res.status(500).send("Internal server error");
	}
};

const putHeadline = async (req, res) => {
	let username = req.user.username;
	const headline = req.body.headline;

	if (!headline) {
		res.status(400).send("Bad input");
		return;
	}
	try {
		const updatedProfile = await Profile.findOneAndUpdate(
			{ username: username },
			{ headline: headline },
			{ new: true }
		).exec();

		if (updatedProfile === null) {
			res.status(404).send("User not found");
			return;
		}

		let msg = { username: username, headline: updatedProfile.headline };
		res.status(200).send(msg);
		return;
	} catch (err) {
		return res.status(500).send("Internal server error");
	}
};

/**
 * get and set email.
 * @param {*} req
 * @param {*} res
 */
const getEmail = async (req, res) => {
	let username = req.params.user;

	// extract loggedin user from session
	if (username === undefined) {
		username = req.user.username;
	}

	try {
		const profile = await Profile.findOne({ username: username }).exec();

		if (profile === null) {
			res.status(404).send("User not found");
			return;
		}

		let msg = { username: username, email: profile.email };
		res.status(200).send(msg);
		return;
	} catch (err) {
		return res.status(500).send("Internal server error");
	}
};

const putEmail = async (req, res) => {
	let username = req.user.username;
	const email = req.body.email;

	if (!email) {
		res.status(400).send("Bad input");
		return;
	}

	try {
		const updatedProfile = await Profile.findOneAndUpdate(
			{ username: username },
			{ email: email },
			{ new: true }
		).exec();

		if (updatedProfile === null) {
			res.status(404).send("User not found");
			return;
		}

		let msg = { username: username, email: updatedProfile.email };
		res.status(200).send(msg);
		return;
	} catch (err) {
		return res.status(500).send("Internal server error");
	}
};

/**
 * get and set zipcode.
 * @param {*} req
 * @param {*} res
 */
const getZipcode = async (req, res) => {
	let username = req.params.user;

	// extract loggedin user from session
	if (username === undefined) {
		username = req.user.username;
	}

	try {
		const profile = await Profile.findOne({ username: username }).exec();

		if (profile === null) {
			res.status(404).send("User not found");
			return;
		}

		let msg = { username: username, zipcode: profile.zipcode };
		res.status(200).send(msg);
		return;
	} catch (err) {
		return res.status(500).send("Internal server error");
	}
};

const putZipcode = async (req, res) => {
	let username = req.user.username;
	const zipcode = req.body.zipcode;

	if (!zipcode) {
		res.status(400).send("Bad input");
		return;
	}

	try {
		const updatedProfile = await Profile.findOneAndUpdate(
			{ username: username },
			{ zipcode: zipcode },
			{ new: true }
		).exec();

		if (updatedProfile === null) {
			res.status(404).send("User not found");
			return;
		}

		let msg = { username: username, zipcode: updatedProfile.zipcode };
		res.status(200).send(msg);
		return;
	} catch (err) {
		return res.status(500).send("Internal server error");
	}
};

/**
 * get dob.
 * @param {*} req
 * @param {*} res
 */
const getDob = async (req, res) => {
	let username = req.params.user;

	// extract loggedin user from session
	if (username === undefined) {
		username = req.user.username;
	}

	try {
		const profile = await Profile.findOne({ username: username }).exec();

		if (profile === null) {
			res.status(404).send("User not found");
			return;
		}

		let msg = { username: username, dob: profile.dob };
		res.status(200).send(msg);
		return;
	} catch (err) {
		return res.status(500).send("Internal server error");
	}
};

/**
 * get and set avatar.
 * @param {*} req
 * @param {*} res
 */
const getAvatar = async (req, res) => {
	let username = req.params.user;

	// extract loggedin user from session
	if (username === undefined) {
		username = req.user.username;
	}

	try {
		const profile = await Profile.findOne({ username: username }).exec();

		if (profile === null) {
			res.status(404).send("User not found");
			return;
		}

		let msg = { username: username, avatar: profile.avatar };
		res.status(200).send(msg);
		return;
	} catch (err) {
		return res.status(500).send("Internal server error");
	}
};

const uploadAvatar = async (req, res) => {
	let username = req.user.username;
	// fileurl added by the middleware
	const avatar = req.fileurl;

	if (!avatar) {
		res.status(400).send("Bad input");
		return;
	}

	try {
		const oldProfile = await Profile.findOne({ username: username }).exec();

		if (oldProfile === null) {
			res.status(404).send("User not found");
			return;
		}

		const updatedProfile = await Profile.findOneAndUpdate(
			{ username: username },
			{ avatar: avatar },
			{ new: true }
		).exec();

		await Article.updateMany({ author: username }, {avatar: avatar}).exec();
		await Comment.updateMany({ author: username }, {avatar: avatar}).exec();

		let msg = { username: username, avatar: updatedProfile.avatar };
		res.status(200).send(msg);
		return;
	} catch (err) {
		return res.status(500).send("Internal server error");
	}
};

module.exports = (app) => {
	app.get("/profile/:user?", getProfile);

	// display name
	app.get("/displayname/:user?", getDisplayName);
	app.put("/displayname", putDisplayName);

	// phone
	app.get("/phone/:user?", getPhoneNumber);
	app.put("/phone", putPhoneNumber);

	// headline
	app.get("/headline/:user?", getHeadline);
	app.put("/headline", putHeadline);

	// email
	app.get("/email/:user?", getEmail);
	app.put("/email", putEmail);

	// zipcode
	app.get("/zipcode/:user?", getZipcode);
	app.put("/zipcode", putZipcode);

	// dob
	app.get("/dob/:user?", getDob);

	// avatar
	app.get("/avatar/:user?", getAvatar);
	app.put("/avatar", uploadImage("avatar"), uploadAvatar);
};
