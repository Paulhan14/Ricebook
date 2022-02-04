const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth").OAuth2Strategy;
const mongoose = require("mongoose");
const User = mongoose.model("users");
const Profile = mongoose.model("profiles");

passport.serializeUser((user, done) => {
	// user.id: document id from MongoDB
	done(null, user);
});

passport.deserializeUser((user, done) => {
	done(null, user);
});

passport.use(
	new GoogleStrategy(
		{
			clientID:
				"635932567631-kj7s6dt4qsalpt3p64gcp2rg1mdmja33.apps.googleusercontent.com",
			clientSecret: "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",
			callbackURL: "/auth/google/callback",
			proxy: true,
		},
		// access token: used to access user account
		async (accessToken, refreshToken, profile, done) => {
			// try to find a user with this google id
			const existingUser = await User.findOne({ googleId: profile.id });

			if (existingUser) {
				return done(null, existingUser);
			}

			let user = {
				username: profile.name.givenName + profile.name.familyName + profile.id.substring(16),
				googleId: profile.id,
			};

			let mongoProfile = {
				username: profile.name.givenName + profile.name.familyName + profile.id.substring(16),
				displayname: profile.displayName,
				email: profile.emails[0].value,
				zipcode: "",
				dob: "",
				phone: "",
				avatar: profile.photos[0].value,
				headline: "",
				following: [],
			}

			const created = await new User(user).save();
			await new Profile(mongoProfile).save();
			done(null, created);
		}
	)
);
