import React from "react";

import Profile from "../components/Profile";
import Adapter from "enzyme-adapter-react-16";
import { mount, configure } from "enzyme";
import configureStore from "../store";
import { Provider } from "react-redux";

import { userLogin } from "../reducers/authReducer";
import { cleanup } from "@testing-library/react";
import Comment from "../components/Main/Comment";
import { ListItemText } from "@mui/material";

const mockComment = {
	postId: 1,
	id: 1,
	name: "id labore ex et quam laborum",
	email: "Eliseo@gardner.biz",
	body: "laudantium enim quasi est quidem magnam voluptate ipsam eos\ntempora quo necessitatibus\ndolor quam autem quasi\nreiciendis et nam sapiente accusantium",
};

configure({ adapter: new Adapter() });
describe("Validate Comment display", () => {
	afterEach(cleanup);

	it("should show comment", () => {
		const wrapper = mount(<Comment comment={mockComment} />);

		const itemText = wrapper.find(ListItemText).last();

        expect(itemText.html()).toContain(mockComment.email);
	});
});
