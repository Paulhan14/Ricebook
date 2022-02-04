import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    text: "",
    location: "/",
};

//it's an object where the keys will become action type strings,
//and the functions are reducers that will be run when that action type is dispatched.
const searchSlice = createSlice({
	name: "search",
	initialState,
	reducers: {
		updateSearch(state, action) {
			state.text = action.payload.text;
			state.location = action.payload.location;
		}
	},
});

export const { updateSearch } = searchSlice.actions;

export default searchSlice.reducer;
