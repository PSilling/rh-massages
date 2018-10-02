// react imports
import React from 'react';
import TestRenderer from 'react-test-renderer';

// test imports
import Tab from '../../../components/navs/Tab';

test('renders content with correct props', () => {
  const testFunction = jest.fn(),
        testRenderer = TestRenderer.create(
          <Tab label="test" onClick={testFunction} />
        ),
        testInstance = testRenderer.root;

  let list = testInstance.findByType('li'),
      link = testInstance.findByType('a'),
      treeJSON = testRenderer.toJSON();

  expect(testFunction).not.toHaveBeenCalled();

  link.props.onClick();

  expect(testFunction).toHaveBeenCalledTimes(1);
  expect(list.props.className).toBe("");
  expect(link.props.children).toEqual("test");
  expect(link.props.onClick).toBe(testFunction);
  expect(treeJSON).toMatchSnapshot();
});

test('activates Tab based on activation prop', () => {
  const testRenderer = TestRenderer.create(
          <Tab active label="active" />
        ),
        testInstance = testRenderer.root;

  let list = testInstance.findByType('li'),
      link = testInstance.findByType('a');

  expect(list.props.className).toBe("active");
  expect(link.props.children).toEqual("active");
});
