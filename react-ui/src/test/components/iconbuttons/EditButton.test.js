// react imports
import React from 'react';
import TestRenderer from 'react-test-renderer';

// test imports
import EditButton from '../../../components/iconbuttons/EditButton';

test('renders content with correct props', () => {
  const testFunction = jest.fn(),
        testRenderer = TestRenderer.create(
          <EditButton onEdit={testFunction} />
        ),
        testInstance = testRenderer.root;

  let button = testInstance.findByType('button'),
      icon = testInstance.findByProps({ className: "glyphicon glyphicon-pencil" }),
      treeJSON = testRenderer.toJSON();

  expect(testFunction).not.toHaveBeenCalled();

  button.props.onClick();

  expect(testFunction).toHaveBeenCalledTimes(1);
  expect(button.props.onClick).toBe(testFunction);
  expect(treeJSON).toMatchSnapshot();
});
