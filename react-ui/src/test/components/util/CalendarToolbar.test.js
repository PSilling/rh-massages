// react imports
import React from "react";
import TestRenderer from "react-test-renderer";

// test imports
import CalendarToolbar from "../../../components/util/CalendarToolbar";

test("renders content with correct props", () => {
  const testLeftFunction = jest.fn();
  const testRightFunction = jest.fn();
  const testViewFunction = jest.fn(string => string);
  const testRenderer = TestRenderer.create(
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
  const testInstance = testRenderer.root;
  const buttons = testInstance.findAllByType("button");
  const month = testInstance.findByType("strong");
  const treeJSON = testRenderer.toJSON();

  testInstance.findByProps({ className: "glyphicon glyphicon-chevron-left" });
  testInstance.findByProps({ className: "glyphicon glyphicon-chevron-right" });

  expect(buttons[0].props.onClick).toBe(testLeftFunction);
  expect(buttons[0].props.disabled).toBe(false);
  expect(buttons[1].props.onClick()).toBe("work_week");
  expect(buttons[1].props.className).toBe("btn btn-default");
  expect(buttons[2].props.onClick()).toBe("month");
  expect(buttons[2].props.className).toBe("btn btn-default active");
  expect(buttons[3].props.onClick).toBe(testRightFunction);
  expect(buttons[3].props.disabled).toBe(true);
  expect(month.props.children).toEqual("test");
  expect(treeJSON).toMatchSnapshot();
});
