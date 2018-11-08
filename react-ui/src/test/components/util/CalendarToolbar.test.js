// react imports
import React from "react";
import { shallow } from "enzyme";

// test imports
import { Button } from "reactstrap";
import CalendarToolbar from "../../../components/util/CalendarToolbar";
import TooltipIconButton from "../../../components/iconbuttons/TooltipIconButton";

test("renders content with correct props", () => {
  const testLeftFunction = jest.fn();
  const testRightFunction = jest.fn();
  const testViewFunction = jest.fn(string => string);
  const wrapper = shallow(
    <CalendarToolbar
      month="test"
      monthActive
      leftDisabled={false}
      rightDisabled
      leftAction={testLeftFunction}
      rightAction={testRightFunction}
      onViewChange={testViewFunction}
    />
  );
  const buttons = wrapper.find(Button);
  const iconButtons = wrapper.find(TooltipIconButton);
  const month = wrapper.find("strong");

  expect(iconButtons.get(0).props.onClick).toBe(testLeftFunction);
  expect(iconButtons.get(0).props.disabled).toBe(false);
  expect(buttons.get(0).props.onClick()).toBe("work_week");
  expect(buttons.get(0).props.active).toBe(false);
  expect(buttons.get(1).props.onClick()).toBe("month");
  expect(buttons.get(1).props.active).toBe(true);
  expect(iconButtons.get(1).props.onClick).toBe(testRightFunction);
  expect(iconButtons.get(1).props.disabled).toBe(true);
  expect(month.props().children).toEqual("test");
  expect(wrapper).toMatchSnapshot();
});
