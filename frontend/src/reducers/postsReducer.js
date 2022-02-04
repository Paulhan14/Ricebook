import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

import { getArticle } from "../api/api";

export const fetchPosts = createAsyncThunk("posts/fetchPosts", async () => {
	try {
		const response = await getArticle();
		return response.data;
	} catch (err) {
		return {};
	}
});

const initialState = {
	items: [],
	status: "idle",
	error: null,
};

const postsSlice = createSlice({
	name: "posts",
	initialState,
	reducers: {
		postAdded(state, action) {
			state.items.push(action.payload);
		},
		postsReplaceAll(state, action) {
			state.items = action.payload;
		},
		updatePosts(state, action) {
			state.status = "succeeded";
			state.items = state.items.concat(action.payload);
		},
		triggerPostUpdate(state, action) {
			state.status = "idle";
		},
		clearPosts(state, action) {
			state.items = [];
			state.status = "idle";
			state.error = null;
		},
	},
	extraReducers(builder) {
		builder
			.addCase(fetchPosts.pending, (state, action) => {
				state.status = "loading";
			})
			.addCase(fetchPosts.fulfilled, (state, action) => {
				state.status = "succeeded";
				state.items = action.payload.articles;
			})
			.addCase(fetchPosts.rejected, (state, action) => {
				state.status = "failed";
				state.error = action.error.message;
			});
	},
});

export const { postAdded, updatePosts, postsReplaceAll, triggerPostUpdate, clearPosts } = postsSlice.actions;

export default postsSlice.reducer;
