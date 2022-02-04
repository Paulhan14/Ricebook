import React from "react";

import Profile from "../components/Profile";
import Adapter from "enzyme-adapter-react-16";
import { mount, configure } from "enzyme";
import configureStore from "../store";
import { Provider } from "react-redux";

import { userLogin } from "../reducers/authReducer";
import { TextField } from "@mui/material";
import { cleanup } from "@testing-library/react";

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


jest.mock("react-router-dom", () => ({
	useHistory: () => ({
		push: jest.fn(),
	}),
    useLocation: () => ({
        pathname: jest.fn(),
    }),
}));

configure({ adapter: new Adapter() });
describe("Validate Profile actions", () => {
    afterEach(cleanup);

	it("should fetch the logged in user's profile username", () => {
        const store = configureStore;
		// inject mock user
		store.dispatch(userLogin(userMock));
		const wrapper = mount(
			<Provider store={store}>
				<Profile />
			</Provider>
		);

		const displayName = wrapper.find("#display-name-profile").first().props().value;
		expect(displayName).toContain(userMock["user"]["displayName"]);
	});

	it("should update display name", () => {
        const store = configureStore;
		// inject mock user
		store.dispatch(userLogin(userMock));
		const wrapper = mount(
			<Provider store={store}>
				<Profile />
			</Provider>
		);

		
		const displayInput = wrapper.find("#display-name-input").last();
		displayInput.simulate("change", {target: {name:"displayName", value: "My Name"}});
		const updateBtn = wrapper.find("#update-btn").last();
		updateBtn.simulate("click");
		const displayName = wrapper.find("#display-name-profile").last().props().value;
		expect(displayName).toContain("My Name");
	});

	it("should report error", () => {
        const store = configureStore;
		// inject mock user
		store.dispatch(userLogin(userMock));
		const wrapper = mount(
			<Provider store={store}>
				<Profile />
			</Provider>
		);

		const emailInput = wrapper.find("#email-address-input").last();
		emailInput.simulate("change", {target: {name:"email", value: "a.com"}});

		const phoneInput = wrapper.find("#phone-number-input").last();
		phoneInput.simulate("change", {target: {name:"phoneNumber", value: "1231231234"}});

		const zipcodeInput = wrapper.find("#zipcode-input").last();
		zipcodeInput.simulate("change", {target: {name:"zipcode", value: "asdfd"}});
		

		const updateBtn = wrapper.find("#update-btn").last();
		updateBtn.simulate("click");
	});
});
