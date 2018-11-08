// react imports
import React from "react";
import { shallow } from "enzyme";

// test imports
import { Button, Tooltip } from "reactstrap";
import TooltipIconButton from "../../../components/iconbuttons/TooltipIconButton";

test("renders content with correct props", () => {
  const testFunction = jest.fn();
  const wrapper = shallow(<TooltipIconButton icon="edit" onClick={testFunction} tooltip="tooltip" />);
  const button = wrapper.find(Button);
  const tooltip = wrapper.find(Tooltip);
  const spans = wrapper.find("span");

  expect(testFunction).not.toHaveBeenCalled();

  button.props().onClick();

  expect(testFunction).toHaveBeenCalledTimes(1);
  expect(button.props().onClick).toBe(testFunction);
  expect(button.props().style).toEqual({ border: "0px solid transparent" });
  expect(button.props().size).toEqual("sm");
  expect(button.props().disabled).toBe(false);
  expect(tooltip.props().isOpen).toBe(false);
  expect(tooltip.props().children).toEqual("tooltip");
  expect(tooltip.props().target).toEqual(button.props().id);
  expect(spans.get(1).props.className).toEqual("fas fa-edit");
  expect(wrapper).toMatchSnapshot();
});
