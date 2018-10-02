// react imports
import React from 'react';
import TestRenderer from 'react-test-renderer';

// test imports
import Auth from '../../../util/Auth';
import BatchButton from '../../../components/buttons/BatchButton';
import DeleteButton from '../../../components/iconbuttons/DeleteButton';
import EditButton from '../../../components/iconbuttons/EditButton';
import MassageEventModal from '../../../components/modals/MassageEventModal';
import ModalActions from '../../../components/buttons/ModalActions';
import _t from '../../../util/Translations';

// test mocks
jest.mock('../../../util/Auth');

afterEach(() => {
  jest.resetAllMocks();
});

test('renders inside content with correct props', () => {
  const testConfirmFunction = jest.fn(),
        testCloseFunction = jest.fn(),
        testEditFunction = jest.fn(),
        testDeleteFunction = jest.fn(),
        testEvent = {
          bgColor: "white",
          massage : {
            id: 1,
            date: new Date(0),
            ending: new Date(1000),
            client: null,
            facility: { id: 1, name: "test" }
          }
        },
        testRenderer = TestRenderer.create(
          <MassageEventModal
            event={testEvent}
            label={ _t.translate('Assign me') }
            onConfirm={testConfirmFunction}
            onClose={testCloseFunction}
            onEdit={testEditFunction}
            onDelete={testDeleteFunction}
            withPortal={false}
          />
        ),
        testInstance = testRenderer.root;

  let editButton = testInstance.findByType(EditButton),
      deleteButton = testInstance.findByType(DeleteButton),
      actions = testInstance.findByType(ModalActions),
      definitions = testInstance.findAllByType('dd'),
      successParagraph = testInstance.findByProps({ className: "text-success" }),
      treeJSON = testRenderer.toJSON();

  expect(editButton.props.onEdit).toBe(testEditFunction);
  expect(deleteButton.props.onDelete).toBe(testDeleteFunction);
  expect(actions.props.children).not.toEqual('');
  expect(actions.props.title).toBe('');
  expect(actions.props.disabled).toBe(false);
  expect(actions.props.onProceed).toBe(testConfirmFunction);
  expect(actions.props.onClose).toBe(testCloseFunction);
  expect(definitions[0].props.children).toEqual(testEvent.massage.facility.name);
  expect(treeJSON).toMatchSnapshot();
});

test('applies correct non-editation mode changes', () => {
  const testConfirmFunction = jest.fn(),
        testCloseFunction = jest.fn(),
        testEvent = {
          bgColor: "white",
          massage : {
            id: 1,
            date: new Date(0),
            ending: new Date(1000),
            client: "test",
            facility: { id: 1, name: "test" }
          }
        },
        testRenderer = TestRenderer.create(
          <MassageEventModal event={testEvent} label="test" onConfirm={testConfirmFunction}
            onClose={testCloseFunction} withPortal={false} />
        ),
        testInstance = testRenderer.root;

    let editButtons = testInstance.findAllByType(EditButton),
        dangerParagraph = testInstance.findByProps({ className: "text-danger" });

    expect(editButtons.length).toBe(0);
});

test('hides non-admin buttons properly', () => {
  Auth.isAuthenticated = jest.fn().mockImplementation(() => true);
  Auth.isAdmin = jest.fn().mockImplementation(() => false);

  const testConfirmFunction = jest.fn(),
        testCloseFunction = jest.fn(),
        testEvent = {
          bgColor: "white",
          massage : {
            id: 1,
            date: new Date(0),
            ending: new Date(1000),
            client: null,
            facility: { id: 1, name: "test" }
          }
        },
        testRenderer = TestRenderer.create(
          <MassageEventModal event={testEvent} label="test" onConfirm={testConfirmFunction}
            onClose={testCloseFunction} withPortal={false} />
        ),
        testInstance = testRenderer.root;

  let editButtons = testInstance.findAllByType(EditButton),
      deleteButtons = testInstance.findAllByType(DeleteButton);

  expect(editButtons.length).toBe(0);
  expect(deleteButtons.length).toBe(0);
});
