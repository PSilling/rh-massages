// react imports
import React from "react";
import TestRenderer from "react-test-renderer";

// test imports
import AddButton from "../../../components/iconbuttons/AddButton";
import FacilityModal from "../../../components/modals/FacilityModal";
import ModalActions from "../../../components/buttons/ModalActions";
import _t from "../../../util/Translations";

// test mocks
jest.mock("../../../util/Util");

test("renders inside content with correct props", () => {
  const testGetFunction = jest.fn();
  const testToggleFunction = jest.fn();
  const testRenderer = TestRenderer.create(
    <FacilityModal
      active
      facility={null}
      getCallback={testGetFunction}
      onToggle={testToggleFunction}
      withPortal={false}
    />
  );
  const testInstance = testRenderer.root;
  const button = testInstance.findByType(AddButton);
  const actions = testInstance.findByType(ModalActions);
  const heading = testInstance.findByType("h2");
  const input = testInstance.findByType("input");
  const treeJSON = testRenderer.toJSON();

  expect(testToggleFunction).not.toHaveBeenCalled();

  actions.props.onClose();

  expect(testToggleFunction).toHaveBeenCalledTimes(1);
  expect(testGetFunction).not.toHaveBeenCalled();

  actions.props.onProceed();

  expect(testToggleFunction).toHaveBeenCalledTimes(1);
  expect(testGetFunction).not.toHaveBeenCalled();
  expect(button.props.onAdd).toBe(testToggleFunction);
  expect(heading.props.children).toEqual(_t.translate("New Facility"));
  expect(input.props.value).toBe("");
  expect(treeJSON).toMatchSnapshot();
});

test("switches to edit mode when a Facility is given", () => {
  const testGetFunction = jest.fn();
  const testToggleFunction = jest.fn();
  const testFacility = { id: 1, name: "test" };
  const testRenderer = TestRenderer.create(
    <FacilityModal
      active
      facility={null}
      getCallback={testGetFunction}
      onToggle={testToggleFunction}
      withPortal={false}
    />
  );
  const testInstance = testRenderer.root;

  testRenderer.update(
    <FacilityModal
      active
      facility={testFacility}
      getCallback={testGetFunction}
      onToggle={testToggleFunction}
      withPortal={false}
    />
  );

  const actions = testInstance.findByType(ModalActions);
  const heading = testInstance.findByType("h2");
  const input = testInstance.findByType("input");

  expect(testToggleFunction).not.toHaveBeenCalled();
  expect(testGetFunction).not.toHaveBeenCalled();

  actions.props.onProceed();

  expect(testToggleFunction).toHaveBeenCalledTimes(1);
  expect(testGetFunction).toHaveBeenCalledTimes(1);
  expect(heading.props.children).toEqual(_t.translate("Edit Facility"));
  expect(actions.props.primaryLabel).toBe(_t.translate("Edit"));
  expect(input.props.value).toBe("test");
  jest.resetAllMocks();
});
