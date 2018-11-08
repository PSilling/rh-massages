// react imports
import React from "react";
import TestRenderer from "react-test-renderer";

// test imports
import { NavLink } from "reactstrap";
import Tab from "../../../components/navs/Tab";

test("renders content with correct props", () => {
  const testFunction = jest.fn();
  const testRenderer = TestRenderer.create(<Tab label="test" onClick={testFunction} />);
  const testInstance = testRenderer.root;
  const link = testInstance.findByType(NavLink);
  const spans = testInstance.findAllByType("span");
  const treeJSON = testRenderer.toJSON();

  expect(testFunction).not.toHaveBeenCalled();

  link.props.onClick();

  expect(testFunction).toHaveBeenCalledTimes(1);
  expect(spans.length).toBe(0);
  expect(treeJSON).toMatchSnapshot();
});

test("activates Tab based on activation prop", () => {
  const testFunction = jest.fn();
  const testRenderer = TestRenderer.create(<Tab active label="active" onRemoveClick={testFunction} />);
  const testInstance = testRenderer.root;
  const link = testInstance.findByType(NavLink);
  const removeLink = testInstance.findByType("span");

  link.props.onClick();
  expect(testFunction).not.toHaveBeenCalled();
  removeLink.props.onClick();

  expect(link.props.className).toBe("active");
  expect(testFunction).toHaveBeenCalledTimes(1);
  expect(removeLink.props.onClick).toBe(testFunction);
});
