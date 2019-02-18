// react imports
import React from "react";
import { shallow } from "enzyme";

// test imports
import moment from "moment";
import LabeledInput from "../../../components/formitems/LabeledInput";
import ModalActions from "../../../components/buttons/ModalActions";
import PrintModal from "../../../components/modals/PrintModal";
import TooltipIconButton from "../../../components/iconbuttons/TooltipIconButton";

// test mocks
jest.mock("../../../util/Fetch");

beforeAll(() => {
  Date.now = jest.fn(() => 0);
});

afterEach(() => {
  jest.resetAllMocks();
});

test("renders inside content with correct props and functionality", () => {
  const testFunction = jest.fn();
  const testMasseuses = [
    {
      sub: "m-sub",
      name: "Masseuse",
      surname: "Test",
      email: "test@masseuse.org",
      subscribed: false,
      masseur: true
    }
  ];
  const testMasseuseNames = ["Masseuse Test"];
  const wrapper = shallow(
    <PrintModal
      masseuses={testMasseuses}
      masseuseNames={testMasseuseNames}
      facilityId={1}
      date={moment(0)}
      onPrint={testFunction}
      withPortal={false}
    />
  );
  const button = wrapper.find(TooltipIconButton);

  button.props().onClick();
  expect(wrapper.instance().state.active).toBe(true);

  const actions = wrapper.find(ModalActions);
  const input = wrapper.find(LabeledInput);

  expect(actions.props().onClose).toBe(button.props().onClick);
  expect(input.props().options).toBe(testMasseuseNames);

  actions.props().onProceed();

  expect(testFunction).not.toHaveBeenCalled();
  expect(wrapper.instance().state.active).toBe(false);
  expect(wrapper).toMatchSnapshot();
});
