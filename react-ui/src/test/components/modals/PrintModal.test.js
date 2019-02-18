// react imports
import React from "react";
import { shallow } from "enzyme";

// test imports
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
  const testEvents = [
    {
      bgColor: "white",
      massage: {
        id: 1,
        date: new Date(0),
        ending: new Date(1000),
        masseuse: {
          sub: "m-sub",
          name: "Masseuse",
          surname: "Test",
          email: "test@masseuse.org",
          subscribed: false,
          masseur: true
        },
        client: null,
        facility: { id: 1, name: "test" }
      }
    }
  ];
  const wrapper = shallow(<PrintModal events={testEvents} onPrint={testFunction} withPortal={false} />);
  const button = wrapper.find(TooltipIconButton);

  button.props().onClick();
  expect(wrapper.instance().state.active).toBe(true);

  const actions = wrapper.find(ModalActions);

  expect(actions.props().onClose).toBe(button.props().onClick);

  actions.props().onProceed();

  expect(testFunction).toHaveBeenCalled();
  expect(wrapper.instance().state.active).toBe(false);
  expect(wrapper).toMatchSnapshot();
});
