// react imports
import React from "react";
import { shallow } from "enzyme";

// test imports
import App, { NavWithLinks } from "../App";
import Auth from "../util/Auth";
import UnauthorizedMessage from "../components/util/UnauthorizedMessage";
import _t from "../util/Translations";

// test mocks
jest.mock("../util/Auth");
jest.mock("../util/Util");

afterEach(() => {
  jest.resetAllMocks();
});

test("renders authenticated user content correctly", () => {
  const wrapper = shallow(<App />);
  const nav = wrapper.find(NavWithLinks);
  const container = wrapper.find({ className: "container" });

  expect(nav.length).toBe(1);
  expect(container.length).toBe(1);
  expect(wrapper).toMatchSnapshot();
});

test("renders unauthorized content correctly", () => {
  Auth.isAuthenticated = jest.fn().mockImplementation(() => false);

  const wrapper = shallow(<App />);
  const message = wrapper.find(UnauthorizedMessage);

  expect(Auth.isAdmin).not.toHaveBeenCalled();
  expect(Auth.isAuthenticated).toHaveBeenCalledTimes(1);
  expect(message.props().title).toBe(_t.translate("Massages"));
  expect(wrapper).toMatchSnapshot();
});
