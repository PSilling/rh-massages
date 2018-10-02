// react imports
import React from 'react';
import TestRenderer from 'react-test-renderer';

// test imports
import DeleteButton from '../../../components/iconbuttons/DeleteButton';
import ConfirmationModal from '../../../components/modals/ConfirmationModal';

test('renders content with correct props', () => {
  const testFunction = jest.fn(),
        testRenderer = TestRenderer.create(
          <DeleteButton onDelete={testFunction} />
        ),
        testInstance = testRenderer.root;

  let button = testInstance.findByType('button'),
      icon = testInstance.findByProps({ className: "glyphicon glyphicon-remove" });

  button.props.onClick();

  let dialog = testInstance.findByType(ConfirmationModal),
      treeJSON = testRenderer.toJSON();

  expect(testFunction).not.toHaveBeenCalled();

  dialog.props.onConfirm();

  expect(testInstance.instance.state.active).toBe(false);
  expect(testFunction).toHaveBeenCalledTimes(1);
  expect(treeJSON).toMatchSnapshot();
});
