// react imports
import React from 'react';
import TestRenderer from 'react-test-renderer';

// test imports
import CalendarButton from '../../../components/iconbuttons/CalendarButton';

test('renders content with correct props', () => {
  const testRenderer = TestRenderer.create(
          <CalendarButton link="test" />
        ),
        testInstance = testRenderer.root;

  let link = testInstance.findByType('a'),
      icon = testInstance.findByProps({ className: "glyphicon glyphicon-calendar" }),
      treeJSON = testRenderer.toJSON();

  expect(link.props.href).toBe("test");
  expect(treeJSON).toMatchSnapshot();
});

test('changes button content when disabled', () => {
  const testRenderer = TestRenderer.create(
          <CalendarButton link="test" disabled />
        ),
        testInstance = testRenderer.root;

  let links = testInstance.findAllByType('a'),
      icon = testInstance.findByProps({ className: "glyphicon glyphicon-calendar" }),
      treeJSON = testRenderer.toJSON();

  expect(links).toHaveLength(0);
  expect(treeJSON).toMatchSnapshot();
});
