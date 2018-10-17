// react imports
import React from "react";
import TestRenderer from "react-test-renderer";

// test imports
import CalendarButton from "../../../components/iconbuttons/CalendarButton";

test("renders content with correct props", () => {
  const testRenderer = TestRenderer.create(<CalendarButton link="test" />);
  const testInstance = testRenderer.root;
  const link = testInstance.findByType("a");
  const treeJSON = testRenderer.toJSON();

  testInstance.findByProps({ className: "glyphicon glyphicon-calendar" });

  expect(link.props.href).toBe("test");
  expect(treeJSON).toMatchSnapshot();
});

test("changes button content when disabled", () => {
  const testRenderer = TestRenderer.create(<CalendarButton link="test" disabled />);
  const testInstance = testRenderer.root;
  const links = testInstance.findAllByType("a");
  const treeJSON = testRenderer.toJSON();

  testInstance.findByProps({ className: "glyphicon glyphicon-calendar" });

  expect(links).toHaveLength(0);
  expect(treeJSON).toMatchSnapshot();
});
