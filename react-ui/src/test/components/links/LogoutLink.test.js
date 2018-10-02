// react imports
import React from 'react';
import TestRenderer from 'react-test-renderer';

// test imports
import LogoutLink from '../../../components/links/LogoutLink';

test('renders content correctly', () => {
  const testRenderer = TestRenderer.create(<LogoutLink />),
        testInstance = testRenderer.root;

  let button = testInstance.findByType('button'),
      icon = testInstance.findByProps({ className: "glyphicon glyphicon-log-out" }),
      treeJSON = testRenderer.toJSON();

  testInstance.instance.logout = jest.fn();
  testRenderer.update(<LogoutLink />);
  button.props.onClick();

  expect(testInstance.instance.logout).toHaveBeenCalledTimes(1);
  expect(treeJSON).toMatchSnapshot();
});
