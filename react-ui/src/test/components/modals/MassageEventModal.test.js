// react imports
import React from "react";
import TestRenderer from "react-test-renderer";

// test imports
import Auth from "../../../util/Auth";
import DeleteButton from "../../../components/iconbuttons/DeleteButton";
import EditButton from "../../../components/iconbuttons/EditButton";
import MassageEventModal from "../../../components/modals/MassageEventModal";
import ModalActions from "../../../components/buttons/ModalActions";
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
      client: null,
      facility: { id: 1, name: "test" }
    }
  };
  const testRenderer = TestRenderer.create(
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
  const testInstance = testRenderer.root;
  const editButton = testInstance.findByType(EditButton);
  const deleteButton = testInstance.findByType(DeleteButton);
  const actions = testInstance.findByType(ModalActions);
  const definitions = testInstance.findAllByType("dd");
  const treeJSON = testRenderer.toJSON();

  testInstance.findByProps({ className: "text-success" });

  expect(editButton.props.onEdit).toBe(testEditFunction);
  expect(deleteButton.props.onDelete).toBe(testDeleteFunction);
  expect(actions.props.children).not.toEqual("");
  expect(actions.props.title).toBe("");
  expect(actions.props.disabled).toBe(false);
  expect(actions.props.onProceed).toBe(testConfirmFunction);
  expect(actions.props.onClose).toBe(testCloseFunction);
  expect(definitions[0].props.children).toEqual(testEvent.massage.facility.name);
  expect(treeJSON).toMatchSnapshot();
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
      client: { sub: "test" },
      facility: { id: 1, name: "test" }
    }
  };
  const testRenderer = TestRenderer.create(
    <MassageEventModal
      event={testEvent}
      label="test"
      onConfirm={testConfirmFunction}
      onClose={testCloseFunction}
      withPortal={false}
    />
  );
  const testInstance = testRenderer.root;
  const editButtons = testInstance.findAllByType(EditButton);

  testInstance.findByProps({ className: "text-danger" });

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
      client: null,
      facility: { id: 1, name: "test" }
    }
  };
  const testRenderer = TestRenderer.create(
    <MassageEventModal
      event={testEvent}
      label="test"
      onConfirm={testConfirmFunction}
      onClose={testCloseFunction}
      withPortal={false}
    />
  );
  const testInstance = testRenderer.root;
  const editButtons = testInstance.findAllByType(EditButton);
  const deleteButtons = testInstance.findAllByType(DeleteButton);

  expect(editButtons.length).toBe(0);
  expect(deleteButtons.length).toBe(0);
});
