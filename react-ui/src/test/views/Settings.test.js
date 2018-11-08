// react imports
import React from "react";
import { shallow } from "enzyme";

// test imports
import Settings from "../../views/Settings";
import Util from "../../util/Util";

// test mocks
jest.mock("../../util/Auth");
jest.mock("../../util/Util");

afterAll(() => {
  jest.resetAllMocks();
});

test("renders content correctly", () => {
  const wrapper = shallow(<Settings />);

  expect(wrapper).toMatchSnapshot();
});

test("properly changes state variables", () => {
  Util.get = jest.fn((url, update) => {
    update(true);
  });
  const wrapper = shallow(<Settings />);

  wrapper.instance().setState({ loading: true, notify: false });
  wrapper.instance().getSettings();
  expect(wrapper.instance().state.notify).toEqual(true);
  expect(wrapper.instance().state.loading).toBe(false);
  wrapper.find({ className: "row" });

  const notifyInput = wrapper.find({
    onChange: wrapper.instance().changeNotify
  });

  expect(notifyInput.props().checked).toBe(true);
  expect(wrapper.instance().state.notify).toBe(true);
  notifyInput.props().onChange({ target: { checked: false } });
  expect(wrapper.instance().state.notify).toBe(false);
  expect(Util.put).toHaveBeenCalledTimes(1);
});
