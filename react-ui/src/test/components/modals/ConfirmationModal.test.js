// react imports
import React from "react";
import TestRenderer from "react-test-renderer";

// test imports
import ConfirmationModal from "../../../components/modals/ConfirmationModal";
import ModalActions from "../../../components/buttons/ModalActions";

test("renders inside content with correct props", () => {
  const testConfirmFunction = jest.fn();
  const testCloseFunction = jest.fn();
  const testRenderer = TestRenderer.create(
    <ConfirmationModal message="test" onConfirm={testConfirmFunction} onClose={testCloseFunction} withPortal={false} />
  );
  const testInstance = testRenderer.root;
  const actions = testInstance.findByType(ModalActions);
  const paragraph = testInstance.findByType("p");
  const treeJSON = testRenderer.toJSON();

  expect(testConfirmFunction).not.toHaveBeenCalled();

  actions.props.onProceed();

  expect(testConfirmFunction).toHaveBeenCalledTimes(1);
  expect(testCloseFunction).not.toHaveBeenCalled();

  actions.props.onClose();

  expect(testCloseFunction).toHaveBeenCalledTimes(1);
  expect(paragraph.props.children).toEqual("test");
  expect(treeJSON).toMatchSnapshot();
});
