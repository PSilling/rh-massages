// react imports
import React from 'react';
import TestRenderer from 'react-test-renderer';

// test imports
import InfoAlert from '../../../components/util/InfoAlert';

test('renders content with correct props', () => {
  const testFunction = jest.fn(),
        testRenderer = TestRenderer.create(<InfoAlert onClose={testFunction} />),
        testInstance = testRenderer.root;

  const button = testInstance.findByType('button'),
        treeJSON = testRenderer.toJSON();

  expect(button.props.onClick).toBe(testFunction);
  expect(treeJSON).toMatchSnapshot();
});
