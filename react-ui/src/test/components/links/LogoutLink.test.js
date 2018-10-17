// react imports
import React from "react";
import TestRenderer from "react-test-renderer";

// test imports
import LogoutLink from "../../../components/links/LogoutLink";

test("renders content correctly", () => {
  const testRenderer = TestRenderer.create(<LogoutLink />);
  const testInstance = testRenderer.root;
  const button = testInstance.findByType("button");
  const treeJSON = testRenderer.toJSON();

  testInstance.findByProps({ className: "glyphicon glyphicon-log-out" });

  testInstance.instance.logout = jest.fn();
  testRenderer.update(<LogoutLink />);
  button.props.onClick();

  expect(testInstance.instance.logout).toHaveBeenCalledTimes(1);
  expect(treeJSON).toMatchSnapshot();
});
