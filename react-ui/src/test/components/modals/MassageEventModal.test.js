// react imports
import React from "react";
import { shallow } from "enzyme";

// test imports
import Auth from "../../../util/Auth";
import ConfirmationIconButton from "../../../components/iconbuttons/ConfirmationIconButton";
import MassageEventModal from "../../../components/modals/MassageEventModal";
import ModalActions from "../../../components/buttons/ModalActions";
import TooltipIconButton from "../../../components/iconbuttons/TooltipIconButton";
import _t from "../../../util/Translations";

// test mocks
jest.mock("../../../util/Auth");

afterEach(() => {
  jest.resetAllMocks();
});

test("renders inside content with correct props", () => {
  const testConfirmFunction = jest.fn();
  const testCloseFunction = jest.fn();
  const testEditFunction = jest.fn();
  const testDeleteFunction = jest.fn();
  const testEvent = {
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
  };
  const wrapper = shallow(
    <MassageEventModal
      event={testEvent}
      label={_t.translate("Assign me")}
      onConfirm={testConfirmFunction}
      onClose={testCloseFunction}
      onEdit={testEditFunction}
      onDelete={testDeleteFunction}
      withPortal={false}
    />
  );
  const editButton = wrapper.find(TooltipIconButton);
  const deleteButton = wrapper.find(ConfirmationIconButton);
  const actions = wrapper.find(ModalActions);
  const definitions = wrapper.find("dd");

  expect(editButton.props().onClick).toBe(testEditFunction);
  expect(deleteButton.props().onConfirm).toBe(testDeleteFunction);
  expect(actions.props().children).not.toEqual("");
  expect(actions.props().disabled).toBe(true);
  expect(actions.props().onProceed).toBe(testConfirmFunction);
  expect(actions.props().onClose).toBe(testCloseFunction);
  expect(definitions.get(0).props.children).toEqual(testEvent.massage.facility.name);
  expect(wrapper).toMatchSnapshot();
});

test("applies correct non-editation mode changes", () => {
  const testConfirmFunction = jest.fn();
  const testCloseFunction = jest.fn();
  const testEvent = {
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
      client: { sub: "test" },
      facility: { id: 1, name: "test" }
    }
  };
  const wrapper = shallow(
    <MassageEventModal
      event={testEvent}
      label="test"
      onConfirm={testConfirmFunction}
      onClose={testCloseFunction}
      withPortal={false}
    />
  );
  const editButtons = wrapper.find(TooltipIconButton);

  expect(editButtons.length).toBe(0);
});

test("hides non-admin buttons properly", () => {
  Auth.isAuthenticated = jest.fn().mockImplementation(() => true);
  Auth.isAdmin = jest.fn().mockImplementation(() => false);

  const testConfirmFunction = jest.fn();
  const testCloseFunction = jest.fn();
  const testEvent = {
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
  };
  const wrapper = shallow(
    <MassageEventModal
      event={testEvent}
      label="test"
      onConfirm={testConfirmFunction}
      onClose={testCloseFunction}
      withPortal={false}
    />
  );
  const editButtons = wrapper.find(TooltipIconButton);
  const deleteButtons = wrapper.find(ConfirmationIconButton);

  expect(editButtons.length).toBe(0);
  expect(deleteButtons.length).toBe(0);
});
