const mongoose = require("mongoose");
const Profile = mongoose.model("profiles");
const User = mongoose.model("users");

const getFollowing = async (req, res) => {
	let username = req.user.username;
	let suppliedName = req.params.user;

	let filter = suppliedName
		? { username: suppliedName }
		: { username: username };

	try {
		// fetch the user profile
		const user = await Profile.findOne(filter).exec();
		// extract user name only
		let followingList = user.following.map((folObj) => folObj.username);

		// fetch all profiles of following
		let followingFilter = {
			username: {
				$in: followingList,
			},
		};
		// query the comments
		const follwingProfile = await Profile.find(followingFilter).exec();

		let updatePayload = follwingProfile.map((folPro) => {
			return {
				username: folPro.username,
				headline: folPro.headline,
				avatar: folPro.avatar,
			};
		});

		const updatedUser = await Profile.findOneAndUpdate(
			filter,
			{ following: updatePayload },
			{ new: true }
		).exec();

		let msg = {
			username: suppliedName ? suppliedName : username,
			following: updatedUser.following,
		};
		return res.status(200).send(msg);
	} catch (err) {
		return res.status(500).send("Internal server error");
	}
};

const addFollowing = async (req, res) => {
	let username = req.user.username;
	let suppliedName = req.params.user;

	if (!suppliedName) {
		res.status(400).send("Bad input");
		return;
	}

	let filter = { username: username };

	try {
		// first check if the user exists or not
		const exists = await User.exists({ username: suppliedName });
		if (!exists) {
			res.status(400).send("User does not exist");
			return;
		}

		const targetUser = await Profile.findOne({
			username: suppliedName,
		}).exec();

		let payload = {
			username: targetUser.username,
			headline: targetUser.headline,
			avatar: targetUser.avatar,
		};

		let updated = await Profile.findOneAndUpdate(
			filter,
			{
				$addToSet: { following: payload },
			},
			{ new: true }
		).exec();

		let msg = { username: username, following: updated.following };
		res.status(200).send(msg);
		return;
	} catch (err) {
		res.status(500).send("Internal server error");
		return;
	}
};

const removeFollowing = async (req, res) => {
	let username = req.user.username;
	let suppliedName = req.params.user;

	if (!suppliedName) {
		res.status(400).send("Bad input");
		return;
	}

	let filter = { username: username };

	try {
		// first check if the user exists or not
		const exists = await User.exists({ username: suppliedName });
		if (!exists) {
			res.status(400).send("User does not exist");
			return;
		}

		let updated = await Profile.findOneAndUpdate(
			filter,
			{
				$pull: { following: { username: suppliedName } },
			},
			{ new: true }
		).exec();

		let msg = { username: username, following: updated.following };
		res.status(200).send(msg);
		return;
	} catch (err) {
		res.status(500).send("Internal server error");
		return;
	}
};

module.exports = (app) => {
	app.get("/following/:user?", getFollowing);
	app.put("/following/:user", addFollowing);
	app.delete("/following/:user", removeFollowing);
};
