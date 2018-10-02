// react imports
import React from 'react';
import TestRenderer from 'react-test-renderer';

// test imports
import CalendarToolbar from '../../../components/util/CalendarToolbar';

test('renders content with correct props', () => {
  const testLeftFunction = jest.fn(),
        testRightFunction = jest.fn(),
        testViewFunction = jest.fn((string) => { return string; }),
        testRenderer = TestRenderer.create(
          <CalendarToolbar
            month="test"
            monthActive={true}
            leftDisabled={false}
            rightDisabled={true}
            leftAction={testLeftFunction}
            rightAction={testRightFunction}
            onViewChange={testViewFunction}
          />
        ),
        testInstance = testRenderer.root;

  let buttons = testInstance.findAllByType('button'),
      iconLeft = testInstance.findByProps({ className: "glyphicon glyphicon-chevron-left" }),
      iconRight = testInstance.findByProps({ className: "glyphicon glyphicon-chevron-right" }),
      month = testInstance.findByType('strong'),
      treeJSON = testRenderer.toJSON();

  expect(buttons[0].props.onClick).toBe(testLeftFunction);
  expect(buttons[0].props.disabled).toBe(false);
  expect(buttons[1].props.onClick()).toBe("work_week");
  expect(buttons[1].props.className).toBe("btn btn-default");
  expect(buttons[2].props.onClick()).toBe("month");
  expect(buttons[2].props.className).toBe("btn btn-default active");
  expect(buttons[3].props.onClick).toBe(testRightFunction);
  expect(buttons[3].props.disabled).toBe(true);
  expect(month.props.children).toEqual("test");
  expect(treeJSON).toMatchSnapshot();
});
