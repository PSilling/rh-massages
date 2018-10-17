// react imports
import React from "react";
import TestRenderer from "react-test-renderer";

// test imports
import DeleteButton from "../../../components/iconbuttons/DeleteButton";
import ConfirmationModal from "../../../components/modals/ConfirmationModal";

test("renders content with correct props", () => {
  const testFunction = jest.fn();
  const testRenderer = TestRenderer.create(<DeleteButton onDelete={testFunction} />);
  const testInstance = testRenderer.root;
  const button = testInstance.findByType("button");

  testInstance.findByProps({ className: "glyphicon glyphicon-trash" });

  button.props.onClick();

  const dialog = testInstance.findByType(ConfirmationModal);

  const treeJSON = testRenderer.toJSON();

  expect(testFunction).not.toHaveBeenCalled();

  dialog.props.onConfirm();

  expect(testInstance.instance.state.active).toBe(false);
  expect(testFunction).toHaveBeenCalledTimes(1);
  expect(treeJSON).toMatchSnapshot();
});
