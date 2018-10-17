// react imports
import React from "react";
import TestRenderer from "react-test-renderer";

// test imports
import AddButton from "../../../components/iconbuttons/AddButton";

test("renders content with correct props", () => {
  const testFunction = jest.fn();
  const testRenderer = TestRenderer.create(<AddButton onAdd={testFunction} />);
  const testInstance = testRenderer.root;
  const button = testInstance.findByType("button");
  const treeJSON = testRenderer.toJSON();

  testInstance.findByProps({ className: "glyphicon glyphicon-plus" });

  expect(testFunction).not.toHaveBeenCalled();

  button.props.onClick();

  expect(testFunction).toHaveBeenCalledTimes(1);
  expect(button.props.onClick).toBe(testFunction);
  expect(treeJSON).toMatchSnapshot();
});
