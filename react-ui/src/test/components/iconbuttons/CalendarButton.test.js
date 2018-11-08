// react imports
import React from "react";
import { shallow } from "enzyme";

// test imports
import { Button, Tooltip } from "reactstrap";
import CalendarButton from "../../../components/iconbuttons/CalendarButton";

test("renders content with correct props", () => {
  const wrapper = shallow(<CalendarButton link="test" />);
  const button = wrapper.find(Button);
  const tooltip = wrapper.find(Tooltip);

  expect(tooltip.props().isOpen).toBe(false);
  expect(tooltip.props().target).toEqual(button.props().id);
  expect(wrapper).toMatchSnapshot();
});
