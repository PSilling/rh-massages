// react imports
import React from "react";
import { shallow } from "enzyme";

// test imports
import LabeledInput from "../../../components/formitems/LabeledInput";
import MassageBatchAddModal from "../../../components/modals/MassageBatchAddModal";
import ModalActions from "../../../components/buttons/ModalActions";
import Tab from "../../../components/navs/Tab";
import TooltipButton from "../../../components/buttons/TooltipButton";

beforeAll(() => {
  Date.now = jest.fn(() => 0);
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

test("user is able to properly manage the number of rules", () => {
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
  let tabs = wrapper.find(Tab);
  expect(wrapper.instance().state.rules.length).toBe(1);

  for (let i = 0; i < 4; i++) {
    tabs.get(1).props.onClick();
  }

  expect(wrapper.instance().state.rules.length).toBe(5);
  expect(wrapper.instance().state.index).toBe(4);

  tabs = wrapper.find(Tab);
  expect(tabs.length).toBe(5);
  expect(tabs.get(4).label).not.toEqual("+");

  for (let i = 0; i < 4; i++) {
    tabs.get(4 - i).props.onRemoveClick();
  }
  tabs = wrapper.find(Tab);

  expect(wrapper.instance().state.rules.length).toBe(1);
  expect(wrapper.instance().state.index).toBe(0);
  expect(tabs.get(1).props.label).toEqual("+");
  expect(tabs.length).toBe(2);
});
