// react imports
import React from "react";
import TestRenderer from "react-test-renderer";

// test imports
import BatchDeleteButton from "../../../components/buttons/BatchDeleteButton";
import ConfirmationModal from "../../../components/modals/ConfirmationModal";

test("renders content with correct props", () => {
  const testFunction = jest.fn();
  const testRenderer = TestRenderer.create(<BatchDeleteButton onDelete={testFunction} label="test" />);
  const testInstance = testRenderer.root;
  const button = testInstance.findByType("button");

  button.props.onClick();

  const dialog = testInstance.findByType(ConfirmationModal);
  const treeJSON = testRenderer.toJSON();

  expect(testFunction).not.toHaveBeenCalled();

  dialog.props.onConfirm();

  expect(testInstance.instance.state.active).toBe(false);
  expect(testFunction).toHaveBeenCalledTimes(1);
  expect(button.props.children).toEqual("test");
  expect(button.props.disabled).toBe(false);
  expect(treeJSON).toMatchSnapshot();
});
