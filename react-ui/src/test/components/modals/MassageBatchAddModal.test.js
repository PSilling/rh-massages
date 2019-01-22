// react imports
import React from "react";
import { shallow } from "enzyme";

// test imports
import LabeledInput from "../../../components/formitems/LabeledInput";
import MassageBatchAddModal from "../../../components/modals/MassageBatchAddModal";
import ModalActions from "../../../components/buttons/ModalActions";
import TooltipButton from "../../../components/buttons/TooltipButton";

beforeAll(() => {
  Date.now = jest.fn(() => 0);
});

afterAll(() => {
  jest.resetAllMocks();
});

test("renders inside content with correct props", () => {
  const testGetFunction = jest.fn();
  const testToggleFunction = jest.fn();
  const testMasseuses = ["test"];
  const wrapper = shallow(
    <MassageBatchAddModal
      active
      facilityId={1}
      masseuses={testMasseuses}
      getCallback={testGetFunction}
      onToggle={testToggleFunction}
      withPortal={false}
    />
  );
  const buttons = wrapper.find(TooltipButton);
  const actions = wrapper.find(ModalActions);
  const inputs = wrapper.find(LabeledInput);

  expect(testToggleFunction).not.toHaveBeenCalled();

  buttons.get(0).props.onClick();

  expect(testToggleFunction).toHaveBeenLastCalledWith(false);

  actions.props().onClose();

  expect(testToggleFunction).toHaveBeenLastCalledWith(false);
  expect(testToggleFunction).toHaveBeenCalledTimes(2);
  expect(testGetFunction).not.toHaveBeenCalled();

  actions.props().onProceed();

  expect(testToggleFunction).toHaveBeenCalledTimes(2);
  expect(testGetFunction).not.toHaveBeenCalled();
  expect(inputs.get(0).props.options).toBe(testMasseuses);
  expect(wrapper).toMatchSnapshot();
});
