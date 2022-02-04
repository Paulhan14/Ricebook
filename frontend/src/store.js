import { configureStore } from "@reduxjs/toolkit";

import postsReducer from "./reducers/postsReducer";
import authReducer from "./reducers/authReducer";
import searchReducer from "./reducers/searchReducer";

export default configureStore({
	reducer: {
		posts: postsReducer,
		auth: authReducer,
		search: searchReducer,
	},
});
