// react imports
import React from 'react';
import TestRenderer from 'react-test-renderer';

// test imports
import MassageFilter from '../../../components/util/MassageFilter';
import Auth from '../../../util/Auth';

// test mocks
jest.mock('../../../util/Auth');

afterEach(() => {
  jest.resetAllMocks();
});

test('renders admin content with correct props', () => {
  const testSelectFunction = jest.fn(),
        testFreeFunction = jest.fn(),
        testFilterFunction = jest.fn(),
        testRenderer = TestRenderer.create(
          <MassageFilter
            filter="test"
            select={false}
            free={true}
            onSelectCheck={testSelectFunction}
            onFreeCheck={testFreeFunction}
            onFilterChange={testFilterFunction}
          />
        ),
        testInstance = testRenderer.root;

  let inputs = testInstance.findAllByType('input'),
      treeJSON = testRenderer.toJSON();

  expect(inputs[0].props.value).toBe("test");
  expect(inputs[0].props.onChange).toBe(testFilterFunction);
  expect(inputs[1].props.onChange).toBe(testFreeFunction);
  expect(inputs[1].props.checked).toBe(true);
  expect(inputs[2].props.onChange).toBe(testSelectFunction);
  expect(inputs[2].props.checked).toBe(false);
  expect(treeJSON).toMatchSnapshot();
});

test('hides non-admin inputs correctly', () => {
  Auth.isAuthenticated = jest.fn().mockImplementation(() => true);
  Auth.isAdmin = jest.fn().mockImplementation(() => false);

  const testFunction = jest.fn(),
        testRenderer = TestRenderer.create(
          <MassageFilter free={false} onFreeCheck={testFunction} />
        ),
        testInstance = testRenderer.root;

  let inputs = testInstance.findAllByType('input');

  expect(inputs.length).toBe(2);
  expect(inputs[1].props.onChange).toBe(testFunction);
  expect(inputs[1].props.checked).toBe(false);
});
