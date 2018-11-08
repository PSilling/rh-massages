// react imports
import React from "react";
import { shallow } from "enzyme";

// test imports
import FacilityModal from "../../../components/modals/FacilityModal";
import LabeledInput from "../../../components/formitems/LabeledInput";
import ModalActions from "../../../components/buttons/ModalActions";
import TooltipIconButton from "../../../components/iconbuttons/TooltipIconButton";
import _t from "../../../util/Translations";

// test mocks
jest.mock("../../../util/Util");

test("renders inside content with correct props", () => {
  const testGetFunction = jest.fn();
  const testToggleFunction = jest.fn();
  const wrapper = shallow(
    <FacilityModal
      active
      facility={null}
      getCallback={testGetFunction}
      onToggle={testToggleFunction}
      withPortal={false}
    />
  );
  const button = wrapper.find(TooltipIconButton);
  const actions = wrapper.find(ModalActions);
  const heading = wrapper.find("h3");
  const input = wrapper.find(LabeledInput);

  expect(testToggleFunction).not.toHaveBeenCalled();

  actions.props().onClose();

  expect(testToggleFunction).toHaveBeenCalledTimes(1);
  expect(testGetFunction).not.toHaveBeenCalled();

  actions.props().onProceed();

  expect(testToggleFunction).toHaveBeenCalledTimes(1);
  expect(testGetFunction).not.toHaveBeenCalled();
  expect(button.props().onClick).toBe(testToggleFunction);
  expect(heading.props().children).toEqual(_t.translate("New Facility"));
  expect(input.props().value).toBe("");
  expect(wrapper).toMatchSnapshot();
});

test("switches to edit mode when a Facility is given", () => {
  const testGetFunction = jest.fn();
  const testToggleFunction = jest.fn();
  const testFacility = { id: 1, name: "test" };
  const wrapper = shallow(
    <FacilityModal
      active
      facility={testFacility}
      getCallback={testGetFunction}
      onToggle={testToggleFunction}
      withPortal={false}
    />
  );
  wrapper.instance().setState({ name: testFacility.name, facility: testFacility });

  const actions = wrapper.find(ModalActions);
  const heading = wrapper.find("h3");
  const input = wrapper.find(LabeledInput);

  expect(testToggleFunction).not.toHaveBeenCalled();
  expect(testGetFunction).not.toHaveBeenCalled();

  actions.props().onProceed();

  expect(testToggleFunction).toHaveBeenCalledTimes(1);
  expect(testGetFunction).toHaveBeenCalledTimes(1);
  expect(heading.props().children).toEqual(_t.translate("Edit Facility"));
  expect(actions.props().primaryLabel).toBe(_t.translate("Edit"));
  expect(input.props().value).toBe("test");
  jest.resetAllMocks();
});
