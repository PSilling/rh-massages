// react imports
import React from "react";
import { shallow } from "enzyme";

// test imports
import { Button, Tooltip } from "reactstrap";
import TooltipButton from "../../../components/buttons/TooltipButton";

test("renders content with correct props", () => {
  const testFunction = jest.fn();
  const wrapper = shallow(<TooltipButton onClick={testFunction} label="test" tooltip="tooltip" />);
  const button = wrapper.find(Button);
  const tooltip = wrapper.find(Tooltip);

  button.props().onClick();

  expect(testFunction).toHaveBeenCalledTimes(1);
  expect(button.props().onClick).toBe(testFunction);
  expect(button.props().children).toEqual("test");
  expect(button.props().disabled).toBe(false);
  expect(tooltip.props().isOpen).toBe(false);
  expect(tooltip.props().children).toEqual("tooltip");
  expect(tooltip.props().target).toEqual(button.props().id);
  expect(wrapper).toMatchSnapshot();
});
