// react imports
import React from "react";
import TestRenderer from "react-test-renderer";

// test imports
import ModalActions from "../../../components/buttons/ModalActions";
import _t from "../../../util/Translations";

test("renders content with correct props", () => {
  const testFunctionProceed = jest.fn();
  const testFunctionClose = jest.fn();
  const testRenderer = TestRenderer.create(
    <ModalActions onProceed={testFunctionProceed} onClose={testFunctionClose}>
      <button type="button" />
    </ModalActions>
  );
  const testInstance = testRenderer.root;
  const treeJSON = testRenderer.toJSON();
  const buttons = testInstance.findAllByType("button");

  expect(testFunctionProceed).not.toHaveBeenCalled();

  buttons[1].props.onClick();

  expect(testFunctionProceed).toHaveBeenCalledTimes(1);

  expect(testFunctionClose).not.toHaveBeenCalled();

  buttons[2].props.onClick();

  expect(testFunctionClose).toHaveBeenCalledTimes(1);
  expect(buttons[1].props.children).toEqual(_t.translate("Proceed"));
  expect(buttons[1].props.onClick).toBe(testFunctionProceed);
  expect(buttons[1].props.title).toBe("");
  expect(buttons[1].props.autoFocus).toBe(false);
  expect(buttons[1].props.disabled).toBe(false);
  expect(buttons[2].props.onClick).toBe(testFunctionClose);
  expect(treeJSON).toMatchSnapshot();
});

test("hides primary button when primaryLabel equals none", () => {
  const testFunctionProceed = jest.fn();
  const testFunctionClose = jest.fn();
  const testRenderer = TestRenderer.create(
    <ModalActions primaryLabel="none" onProceed={testFunctionProceed} onClose={testFunctionClose} />
  );
  const testInstance = testRenderer.root;
  const button = testInstance.findByType("button");

  expect(button.props.onClick).toBe(testFunctionClose);
});
