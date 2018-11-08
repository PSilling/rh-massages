// react imports
import React from "react";
import TestRenderer from "react-test-renderer";

// test imports
import UnauthorizedMessage from "../../../components/util/UnauthorizedMessage";
import _t from "../../../util/Translations";

test("renders content with correct props", () => {
  const testRenderer = TestRenderer.create(<UnauthorizedMessage title="test" />);
  const testInstance = testRenderer.root;
  const header = testInstance.findByType("h2");
  const message = testInstance.findByType("h3");
  const treeJSON = testRenderer.toJSON();

  expect(header.props.children).toEqual("test");
  expect(message.props.children).toEqual(_t.translate("Unauthorized"));
  expect(treeJSON).toMatchSnapshot();
});
