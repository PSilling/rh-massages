// react imports
import React from 'react';
import TestRenderer from 'react-test-renderer';

// test imports
import BatchButton from '../../../components/buttons/BatchButton';
import MassageBatchEditModal from '../../../components/modals/MassageBatchEditModal';
import ModalActions from '../../../components/buttons/ModalActions';

// test mocks
jest.mock('../../../util/Util');

afterEach(() => {
  jest.resetAllMocks();
});

test('renders inside content with correct props', () => {
  const testGetFunction = jest.fn(),
        testToggleFunction = jest.fn(),
        testMassages = [{
          id: 1,
          date: new Date(0),
          ending: new Date(1000),
          client: null,
          facility: { id: 1, name: "test" }
        }],
        testMasseuses = ["test"],
        testRenderer = TestRenderer.create(
          <MassageBatchEditModal active massages={testMassages} masseuses={testMasseuses}
            getCallback={testGetFunction} onToggle={testToggleFunction} withPortal={false} />
        ),
        testInstance = testRenderer.root;

  let button = testInstance.findByType(BatchButton),
      actions = testInstance.findByType(ModalActions),
      datalistOption = testInstance.findByType('option'),
      treeJSON = testRenderer.toJSON();

  expect(testToggleFunction).not.toHaveBeenCalled();

  button.props.onClick();
  actions.props.onClose();

  expect(testToggleFunction).toHaveBeenCalledTimes(2);
  expect(testToggleFunction).toHaveBeenLastCalledWith(false);
  expect(testGetFunction).not.toHaveBeenCalled();

  actions.props.onProceed();

  expect(testToggleFunction).toHaveBeenCalledTimes(3);
  expect(testToggleFunction).toHaveBeenLastCalledWith(true);
  expect(testGetFunction).toHaveBeenCalledTimes(1);
  expect(button.props.disabled).toBe(false);
  expect(datalistOption.props.value).toBe("test");
  expect(treeJSON).toMatchSnapshot();
});
