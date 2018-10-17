// react imports
import React from "react";
import TestRenderer from "react-test-renderer";

// test imports
import BatchButton from "../../../components/buttons/BatchButton";

test("renders content with correct props", () => {
  const testFunction = jest.fn();
  const testRenderer = TestRenderer.create(<BatchButton onClick={testFunction} label="test" />);
  const testInstance = testRenderer.root;
  const button = testInstance.findByType("button");
  const treeJSON = testRenderer.toJSON();

  expect(testFunction).not.toHaveBeenCalled();

  button.props.onClick();

  expect(testFunction).toHaveBeenCalledTimes(1);
  expect(button.props.onClick).toBe(testFunction);
  expect(button.props.children).toEqual("test");
  expect(button.props.disabled).toBe(false);
  expect(treeJSON).toMatchSnapshot();
});
