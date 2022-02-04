import React from "react";

import Header from "../components/Header";
import Main from "../components/Main/Main";
import SignIn from "../components/Landing/SignIn";
import Adapter from "enzyme-adapter-react-16";
import { mount, configure } from "enzyme";
import configureStore from "../store";
import { Provider } from "react-redux";

import { userLogin } from "../reducers/authReducer";
import { updateUsers } from "../reducers/allUserReducer";

jest.mock("react-router-dom", () => ({
	useHistory: () => ({
		push: jest.fn(),
	}),
	useLocation: () => ({
		pathname: jest.fn(),
	}),
}));

configure({ adapter: new Adapter() });
describe("Validate Authentication", () => {
	it("should log in a previously registered user (not new users, login state should be set)", () => {
		const store = configureStore;
		store.dispatch(updateUsers(userList));
		const wrapper = mount(
			<Provider store={store}>
				<SignIn />
			</Provider>
		);

		const accountNameInput = wrapper.find("#account-name-input").last();
		accountNameInput.simulate("change", { target: { value: "Bret" } });

		const passwordInput = wrapper.find("#password-input").last();
		passwordInput.simulate("change", { target: { value: "Kulas Light" } });

		const signInBtn = wrapper.find("#signin-btn").last();
		signInBtn.simulate("click");
		expect(store.getState()["auth"]["loggedin"]).toBeTruthy();
	});

	it("should not log in an invalid user (error state should be set)", () => {
		const store = configureStore;
		store.dispatch(updateUsers(userList));
		const wrapper = mount(
			<Provider store={store}>
				<SignIn />
			</Provider>
		);

		// set to be user 1
		const accountNameInput = wrapper.find("#account-name-input").last();
		accountNameInput.simulate("change", { target: { value: "Bret" } });

		// set a wrong password
		const passwordInput = wrapper.find("#password-input").last();
		passwordInput.simulate("change", { target: { value: "Kulas" } });

		// find the login button and simulate click
		const signInBtn = wrapper.find("#signin-btn").last();
		signInBtn.simulate("click");

		// error should be set to true
		expect(store.getState()["auth"]["error"]).toBeTruthy();
	});

	it("should log out a user (login state should be cleared)", () => {
		const store = configureStore;
		store.dispatch(
			userLogin({
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
			})
		);
		const wrapper = mount(
			<Provider store={store}>
				<Header />
                <Main />
			</Provider>
		);

		// verify that this user is logged in
		expect(wrapper.find("#account-name-main-display").last().html()).toContain("Bret")

		// click logout button then check if state is updated to be logged out
		const signOutBtn = wrapper.find("#logout-btn-header").last();
		signOutBtn.simulate("click");
		expect(store.getState()["auth"]["loggedin"]).toBeFalsy();
	});
});
