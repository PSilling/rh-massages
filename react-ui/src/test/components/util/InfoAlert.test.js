// react imports
import React from "react";
import TestRenderer from "react-test-renderer";

// test imports
import InfoAlert from "../../../components/util/InfoAlert";

test("renders content with correct props", () => {
  const testFunction = jest.fn();
  const testRenderer = TestRenderer.create(<InfoAlert onClose={testFunction}>test</InfoAlert>);
  const testInstance = testRenderer.root;
  const button = testInstance.findByType("button");
  const treeJSON = testRenderer.toJSON();

  expect(button.props.onClick).toBe(testFunction);
  expect(treeJSON).toMatchSnapshot();
});
