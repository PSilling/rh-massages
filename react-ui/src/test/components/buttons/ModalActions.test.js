// react imports
import React from "react";
import TestRenderer from "react-test-renderer";

// test imports
import { Button } from "reactstrap";
import ModalActions from "../../../components/buttons/ModalActions";
import _t from "../../../util/Translations";

test("renders content with correct props", () => {
  const testFunctionProceed = jest.fn();
  const testFunctionClose = jest.fn();
  const testRenderer = TestRenderer.create(
    <ModalActions onProceed={testFunctionProceed} onClose={testFunctionClose}>
      <button type="button" onClick={testFunctionProceed} />
    </ModalActions>
  );
  const testInstance = testRenderer.root;
  const treeJSON = testRenderer.toJSON();
  const buttons = testInstance.findAllByType(Button);
  const standardButtons = testInstance.findAllByType("button");

  expect(testFunctionProceed).not.toHaveBeenCalled();

  buttons[0].props.onClick();

  expect(testFunctionProceed).toHaveBeenCalledTimes(1);
  expect(testFunctionClose).not.toHaveBeenCalled();

  buttons[1].props.onClick();

  expect(testFunctionClose).toHaveBeenCalledTimes(1);
  expect(buttons[0].props.children).toEqual(_t.translate("Proceed"));
  expect(buttons[0].props.onClick).toBe(testFunctionProceed);
  expect(buttons[0].props.disabled).toBe(false);
  expect(buttons[1].props.children).toBe(_t.translate("Dismiss"));
  expect(buttons[1].props.onClick).toBe(testFunctionClose);
  expect(standardButtons[0].props.onClick).toBe(testFunctionProceed);
  expect(treeJSON).toMatchSnapshot();
});

test("hides primary button when primaryLabel equals none", () => {
  const testFunctionProceed = jest.fn();
  const testFunctionClose = jest.fn();
  const testRenderer = TestRenderer.create(
    <ModalActions primaryLabel="none" onProceed={testFunctionProceed} onClose={testFunctionClose} />
  );
  const testInstance = testRenderer.root;
  const button = testInstance.findByType(Button);

  expect(button.props.onClick).toBe(testFunctionClose);
});
