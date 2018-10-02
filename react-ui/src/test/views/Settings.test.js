// react imports
import React from 'react';
import TestRenderer from 'react-test-renderer';

// test imports
import Settings from '../../views/Settings';
import FacilityModal from '../../components/modals/FacilityModal';
import FacilityRow from '../../components/rows/FacilityRow';
import Util from '../../util/Util';

// test mocks
jest.mock('../../util/Auth');
jest.mock('../../util/Util');

afterAll(() => {
  jest.resetAllMocks();
});

test('renders content correctly', () => {
  const testRenderer = TestRenderer.create(<Settings />),
        testInstance = testRenderer.root;

  let treeJSON = testRenderer.toJSON();

  expect(treeJSON).toMatchSnapshot();
});

test('properly changes state variables', () => {
  Util.get = jest.fn((url, update) => { update(true); });
  const testRenderer = TestRenderer.create(<Settings />),
        testInstance = testRenderer.root;

  testInstance.instance.setState({ loading: true, notify: false });
  testInstance.instance.getSettings();
  expect(testInstance.instance.state.notify).toEqual(true);
  expect(testInstance.instance.state.loading).toBe(false);

  let rows = testInstance.findAllByProps({ className: "row" }),
      notifyInput = testInstance.findByProps({
        onChange: testInstance.instance.changeNotify
      });

  expect(notifyInput.props.checked).toBe(true);
  notifyInput.props.onChange({ target: { checked: false } });
  expect(notifyInput.props.checked).toBe(false);
  expect(Util.put).toHaveBeenCalledTimes(1);
});
