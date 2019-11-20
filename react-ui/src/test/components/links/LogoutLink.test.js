// react imports
import React from "react";
import TestRenderer from "react-test-renderer";

// test imports
import { NavLink } from "reactstrap";
import LogoutLink from "../../../components/links/LogoutLink";

test("renders content correctly", () => {
  const testRenderer = TestRenderer.create(<LogoutLink />);
  const treeJSON = testRenderer.toJSON();

  testRenderer.update(<LogoutLink />);

  expect(treeJSON).toMatchSnapshot();
});
