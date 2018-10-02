// react imports
import React from 'react';
import TestRenderer from 'react-test-renderer';

// test imports
import BatchButton from '../../../components/buttons/BatchButton';
import PrintModal from '../../../components/modals/PrintModal';
import ModalActions from '../../../components/buttons/ModalActions';
import moment from 'moment';

// test mocks
jest.mock('../../../util/Util');

beforeAll(() => {
  Date.now = jest.fn(() => 0);
});

afterEach(() => {
  jest.resetAllMocks();
});

test('renders inside content with correct props and functionality', () => {
  const testFunction = jest.fn(),
        testMasseuses = ["test"],
        testRenderer = TestRenderer.create(
          <PrintModal masseuses={testMasseuses} facilityId={1} date={moment(new Date(0))}
            onPrint={testFunction} withPortal={false} />
        ),
        testInstance = testRenderer.root;

  let button = testInstance.findByType(BatchButton);

  button.props.onClick();
  expect(testInstance.instance.state.active).toBe(true);

  let actions = testInstance.findByType(ModalActions),
  datalistOption = testInstance.findByType('option'),
  treeJSON = testRenderer.toJSON();

  expect(actions.props.onClose).toBe(button.props.onClick);
  expect(datalistOption.props.value).toBe("test");

  actions.props.onProceed();

  expect(testFunction).not.toHaveBeenCalled();
  expect(testInstance.instance.state.active).toBe(false);
  expect(treeJSON).toMatchSnapshot();
});
