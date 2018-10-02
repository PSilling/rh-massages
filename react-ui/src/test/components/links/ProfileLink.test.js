// react imports
import React from 'react';
import TestRenderer from 'react-test-renderer';

// test imports
import ProfileLink from '../../../components/links/ProfileLink';

test('renders content correctly', () => {
  const testRenderer = TestRenderer.create(<ProfileLink />),
        testInstance = testRenderer.root;

  let button = testInstance.findByType('button'),
      icon = testInstance.findByProps({ className: "glyphicon glyphicon-user" }),
      treeJSON = testRenderer.toJSON();

  testInstance.instance.viewProfile = jest.fn();
  testRenderer.update(<ProfileLink />);
  button.props.onClick();

  expect(testInstance.instance.viewProfile).toHaveBeenCalledTimes(1);
  expect(treeJSON).toMatchSnapshot();
});
