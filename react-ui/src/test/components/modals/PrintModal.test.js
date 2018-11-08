// react imports
import React from "react";
import { shallow } from "enzyme";

// test imports
import moment from "moment";
import LabeledInput from "../../../components/formitems/LabeledInput";
import ModalActions from "../../../components/buttons/ModalActions";
import PrintModal from "../../../components/modals/PrintModal";
import TooltipButton from "../../../components/buttons/TooltipButton";

// test mocks
jest.mock("../../../util/Util");

beforeAll(() => {
  Date.now = jest.fn(() => 0);
});

afterEach(() => {
  jest.resetAllMocks();
});

test("renders inside content with correct props and functionality", () => {
  const testFunction = jest.fn();
  const testMasseuses = ["test"];
  const wrapper = shallow(
    <PrintModal masseuses={testMasseuses} facilityId={1} date={moment(0)} onPrint={testFunction} withPortal={false} />
  );
  const button = wrapper.find(TooltipButton);

  button.props().onClick();
  expect(wrapper.instance().state.active).toBe(true);

  const actions = wrapper.find(ModalActions);
  const input = wrapper.find(LabeledInput);

  expect(actions.props().onClose).toBe(button.props().onClick);
  expect(input.props().options).toBe(testMasseuses);

  actions.props().onProceed();

  expect(testFunction).not.toHaveBeenCalled();
  expect(wrapper.instance().state.active).toBe(false);
  expect(wrapper).toMatchSnapshot();
});
