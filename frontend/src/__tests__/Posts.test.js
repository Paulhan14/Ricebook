import React from "react";

import Header from "../components/Header";
import Main from "../components/Main/Main";
import UserPost from "../components/Main/Post";
import { Button, CardHeader, IconButton, List, ListItem } from "@mui/material";
import Adapter from "enzyme-adapter-react-16";
import { mount, configure } from "enzyme";
import configureStore from "../store";
import { Provider } from "react-redux";

import { userLogin } from "../reducers/authReducer";
import { updateSearch } from "../reducers/searchReducer";
import { cleanup } from "@testing-library/react";

import { updatePosts } from "../reducers/postsReducer";

const userMock = {
	user: {
		id: 1,
		accountName: "Bret",
		displayName: "Leanne Graham",
		email: "Sincere@april.biz",
		phoneNumber: "770-736-8031",
		birthday: "",
		zipcode: "92998",
		password: "Kulas Light",
		status: "Multi-layered client-server neural-net",
		avatarLink: "https://i.imgur.com/j2XIS80.png",
		following: [1, 2, 3, 4],
		timestamp: 1635399325963,
	},
	loggedin: true,
	error: false,
};

const postMock = postList.map((element) => {
	let newP = {
		author: "",
		userId: element.userId,
		id: element.id,
		title: element.title,
		content: element.body,
		imgLink:
			imgList[Math.floor(Math.random() * imgList.length)],
		timestamp:
			Math.floor(
				Math.random() *
					(new Date().getTime() - 1612756335338)
			) + 1612756335338,
	};
	return newP;
})

jest.mock("react-router-dom", () => ({
	useHistory: () => ({
		push: jest.fn(),
	}),
	useLocation: () => ({
		pathname: "/main",
	}),
}));

configure({ adapter: new Adapter() });
describe("Validate Article actions", () => {
    let wrapper;

	beforeAll(() => {
        const store = configureStore;
		// inject mock user
		store.dispatch(userLogin(userMock));
		store.dispatch(updatePosts(postMock));
		wrapper = mount(
			<Provider store={store}>
				<Header />
				<Main />
			</Provider>
		);
    });

    afterEach(cleanup);

	it("should fetch all articles for current logged in user (posts state is set)", () => {
		// verify that this user is logged in
		expect(
			wrapper.find("#account-name-main-display").last().html()
		).toContain("Bret");



		const allPosts = wrapper
			.find("#posts-grid-container")
			.last()
			.find(UserPost)
			.find(CardHeader);
		const allMockUserPosts = allPosts.filterWhere((comp) =>
			comp.text().includes(userMock["user"]["accountName"])
		);
		expect(allMockUserPosts.length).toBe(10);
	});

	it("should fetch subset of articles for current logged in user given search keyword (posts state is filtered)", () => {
		// verify that this user is logged in
		expect(
			wrapper.find("#account-name-main-display").last().html()
		).toContain("Bret");

        // Before search, showing all 40 posts
        const allPostsBeforeSearch = wrapper.find("#posts-grid-container").last().find(UserPost);
		expect(allPostsBeforeSearch.length).toBe(40);

        const searchInput = wrapper.find("#search-input-header").last();
        searchInput.simulate("change", { target: { value: "Bret"}});

        const findBtn = wrapper.find("#find-btn-header").last();
        findBtn.simulate("click")
        
        // After search, showing only 10 posts (authored by Bret)
        const allPostsAfterSearch = wrapper.find("#posts-grid-container").last().find(UserPost);
		expect(allPostsAfterSearch.length).toBe(10);

        // Reset
        searchInput.simulate("change", { target: { value: ""}});
        findBtn.simulate("click")
	});

	it("should add articles when adding a follower (posts state is larger )", () => {
		// verify that this user is logged in
		expect(
			wrapper.find("#account-name-main-display").last().html()
		).toContain("Bret");

        // Before search, showing 40 posts
        const allPostsBeforeSearch = wrapper.find("#posts-grid-container").last().find(UserPost);
		expect(allPostsBeforeSearch.length).toBe(40);

        const addInput = wrapper.find("#add-following-input-main").last();
        addInput.simulate("change", { target: { value: "Delphine"}});

        const addBtn = wrapper.find("#add-following-btn-main").last();
        addBtn.simulate("click")
        
        const allPostsAfterSearch = wrapper.find("#posts-grid-container").last().find(UserPost);
		expect(allPostsAfterSearch.length).toBe(50);
	});

    it("should remove articles when removing a follower (posts state is smaller)", () => {
		// verify that this user is logged in
		expect(
			wrapper.find("#account-name-main-display").last().html()
		).toContain("Bret");

        const allPostsBeforeSearch = wrapper.find("#posts-grid-container").last().find(UserPost);
		expect(allPostsBeforeSearch.length).toBe(50);

        const deleteBtn = wrapper.find("#friend-list-main").last().find(ListItem).find(IconButton).first()
        deleteBtn.simulate("click")
        
        const allPostsAfterSearch = wrapper.find("#posts-grid-container").last().find(UserPost);
		expect(allPostsAfterSearch.length).toBe(40);
	});

	it("should add a new file", () => {
		// verify that this user is logged in
		expect(
			wrapper.find("#account-name-main-display").last().html()
		).toContain("Bret");

        // Before search, showing 40 posts
        const allPostsBeforeAdd = wrapper.find("#posts-grid-container").last().find(UserPost);
		expect(allPostsBeforeAdd.length).toBe(40);

        const inputSim = wrapper.find("#title-newpost").last()
		inputSim.simulate("change", {target: {name:"title", value: "New Title"}});

		const inputSim2 = wrapper.find("#content-newpost").last()
		inputSim2.simulate("change", {target: {name:"content", value: "New content"}});
		
		const sendBtn = wrapper.find("#send-newpost").last()
		sendBtn.simulate("click")

		const allPostsAfterAdd = wrapper.find("#posts-grid-container").last().find(UserPost);
		expect(allPostsAfterAdd.length).toBe(41);
	});
});
