// react imports
import React from "react";
import TestRenderer from "react-test-renderer";

// test imports
import ProfileLink from "../../../components/links/ProfileLink";

test("renders content correctly", () => {
  const testRenderer = TestRenderer.create(<ProfileLink />);
  const testInstance = testRenderer.root;
  const button = testInstance.findByType("button");
  const treeJSON = testRenderer.toJSON();

  testInstance.findByProps({ className: "glyphicon glyphicon-user" });

  testInstance.instance.viewProfile = jest.fn();
  testRenderer.update(<ProfileLink />);
  button.props.onClick();

  expect(testInstance.instance.viewProfile).toHaveBeenCalledTimes(1);
  expect(treeJSON).toMatchSnapshot();
});
