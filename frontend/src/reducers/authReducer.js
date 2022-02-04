import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getProfile } from "../api/api";

export const fetchProfile = createAsyncThunk("auth/profile", async () => {
	try {
		const response = await getProfile();
		return response.data;
	} catch (err) {
		return {};
	}
});

const initialState = {
	user: {
		id: "",
		accountName: "",
		displayName: "",
		phoneNumber: "",
		email: "",
		birthday: "",
		zipcode: "",
		status: "",
		avatarLink: "",
		following: [],
		timestamp: "",
	},
	loggedin: false,
	error: false,
	status: "idle",
};

//it's an object where the keys will become action type strings,
//and the functions are reducers that will be run when that action type is dispatched.
const authSlice = createSlice({
	name: "auth",
	initialState,
	reducers: {
		userLogin(state, action) {
			state.user = action.payload.user;
			state.loggedin = action.payload.loggedin;
			state.error = action.payload.error;
		},

		userLogout(state, action) {
			state.user = {
				id: "",
				accountName: "",
				displayName: "",
				phoneNumber: "",
				email: "",
				birthday: "",
				zipcode: "",
				status: "",
				avatarLink: "",
				following: [],
				timestamp: "",
			};
			state.loggedin = false;
			state.error = false;
			state.status = "idle";
		},

		triggerProfileUpdate(state, action) {
			state.status = "idle";
		},

		addAvatarLink(state, action) {
			state.user.avatarLink = action.payload;
		},

		updateUserFollowing(state, action) {
			state.user = {
				...state.user,
				following: action.payload.following,
				timestamp: "",
			};
		},
	},
	extraReducers(builder) {
		builder
			.addCase(fetchProfile.pending, (state, action) => {
				state.status = "loading";
			})
			.addCase(fetchProfile.fulfilled, (state, action) => {
				state.status = "succeeded";
				if (action.payload) {
					state.user.id = action.payload._id;
					state.user.status = action.payload.headline;
					state.user.phoneNumber = action.payload.phone;
					state.user.displayName = action.payload.displayname;
					state.user.zipcode = action.payload.zipcode;
					state.user.birthday = action.payload.dob;
					state.user.avatarLink = action.payload.avatar;
					state.user.email = action.payload.email;
					state.user.following = action.payload.following;
				}
			})
			.addCase(fetchProfile.rejected, (state, action) => {
				state.status = "failed";
			});
	},
});

export const { userLogin, userLogout, triggerProfileUpdate, addAvatarLink, updateUserFollowing } = authSlice.actions;

export default authSlice.reducer;
