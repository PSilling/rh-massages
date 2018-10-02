// react imports
import React from 'react';
import TestRenderer from 'react-test-renderer';

// test imports
import BatchButton from '../../../components/buttons/BatchButton';
import MassageBatchAddModal from '../../../components/modals/MassageBatchAddModal';
import ModalActions from '../../../components/buttons/ModalActions';
import Tab from '../../../components/navs/Tab';

beforeAll(() => {
  Date.now = jest.fn(() => 0);
});

test('renders inside content with correct props', () => {
  const testGetFunction = jest.fn(),
        testToggleFunction = jest.fn(),
        testMasseuses = ["test"],
        testRenderer = TestRenderer.create(
          <MassageBatchAddModal active facilityId={1} masseuses={testMasseuses}
            getCallback={testGetFunction} onToggle={testToggleFunction} withPortal={false} />
        ),
        testInstance = testRenderer.root;

  let buttons = testInstance.findAllByType(BatchButton),
      actions = testInstance.findByType(ModalActions),
      datalistOption = testInstance.findByType('option'),
      treeJSON = testRenderer.toJSON();

  expect(testToggleFunction).not.toHaveBeenCalled();

  buttons[0].props.onClick();

  expect(testToggleFunction).toHaveBeenLastCalledWith(false);

  actions.props.onClose();

  expect(testToggleFunction).toHaveBeenLastCalledWith(false);
  expect(testToggleFunction).toHaveBeenCalledTimes(2);
  expect(testGetFunction).not.toHaveBeenCalled();

  actions.props.onProceed();

  expect(testToggleFunction).toHaveBeenCalledTimes(2);
  expect(testGetFunction).not.toHaveBeenCalled();
  expect(datalistOption.props.value).toBe("test");
  expect(treeJSON).toMatchSnapshot();
});

test('user is able to properly manage the number of rules', () => {
  const testGetFunction = jest.fn(),
        testToggleFunction = jest.fn(),
        testMasseuses = ["test"],
        testRenderer = TestRenderer.create(
          <MassageBatchAddModal active facilityId={1} masseuses={testMasseuses}
            getCallback={testGetFunction} onToggle={testToggleFunction} withPortal={false} />
        ),
        testInstance = testRenderer.root;

  let buttons = testInstance.findAllByType(BatchButton);

  expect(testInstance.instance.state.rules.length).toBe(1);

  for (var i = 0; i < 4; i++) {
    buttons[2].props.onClick();
  }
  let tabs = testInstance.findAllByType(Tab);

  expect(testInstance.instance.state.rules.length).toBe(5);
  expect(testInstance.instance.state.index).toBe(4);
  expect(buttons[2].props.disabled).toBe(true);
  expect(buttons[3].props.disabled).toBe(false);
  expect(tabs.length).toBe(5);

  for (var i = 0; i < 4; i++) {
    buttons[3].props.onClick();
  }
  tabs = testInstance.findAllByType(Tab);

  expect(testInstance.instance.state.rules.length).toBe(1);
  expect(testInstance.instance.state.index).toBe(0);
  expect(buttons[2].props.disabled).toBe(false);
  expect(buttons[3].props.disabled).toBe(true);
  expect(tabs.length).toBe(1);
});
