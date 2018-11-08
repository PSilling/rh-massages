// react imports
import React from "react";
import TestRenderer from "react-test-renderer";

// test imports
import { Alert } from "reactstrap";
import InfoAlert from "../../../components/util/InfoAlert";

test("renders content with correct props", () => {
  const testFunction = jest.fn();
  const testRenderer = TestRenderer.create(<InfoAlert onClose={testFunction}>test</InfoAlert>);
  const testInstance = testRenderer.root;
  const alert = testInstance.findByType(Alert);
  const treeJSON = testRenderer.toJSON();

  expect(alert.props.toggle).toBe(testFunction);
  expect(alert.props.children).toEqual("test");
  expect(treeJSON).toMatchSnapshot();
});
