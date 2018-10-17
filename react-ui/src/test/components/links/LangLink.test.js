// react imports
import React from "react";
import TestRenderer from "react-test-renderer";

// test imports
import LangLink from "../../../components/links/LangLink";

test("renders content correctly", () => {
  const testRenderer = TestRenderer.create(<LangLink />);
  const testInstance = testRenderer.root;
  const button = testInstance.findByType("button");
  const treeJSON = testRenderer.toJSON();

  testInstance.findByProps({ className: "glyphicon glyphicon-globe" });

  testInstance.instance.changeLanguage = jest.fn();
  testRenderer.update(<LangLink />);
  button.props.onClick();

  expect(testInstance.instance.changeLanguage).toHaveBeenCalledTimes(1);
  expect(treeJSON).toMatchSnapshot();
});
