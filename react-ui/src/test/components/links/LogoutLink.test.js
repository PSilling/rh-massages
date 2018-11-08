// react imports
import React from "react";
import TestRenderer from "react-test-renderer";

// test imports
import { NavLink } from "reactstrap";
import LogoutLink from "../../../components/links/LogoutLink";

test("renders content correctly", () => {
  const testRenderer = TestRenderer.create(<LogoutLink />);
  const testInstance = testRenderer.root;
  const link = testInstance.findByType(NavLink);
  const treeJSON = testRenderer.toJSON();

  testInstance.instance.logout = jest.fn();
  testRenderer.update(<LogoutLink />);
  link.props.onClick();

  expect(testInstance.instance.logout).toHaveBeenCalledTimes(1);
  expect(treeJSON).toMatchSnapshot();
});
