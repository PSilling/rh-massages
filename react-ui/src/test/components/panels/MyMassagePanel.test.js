// react imports
import React from "react";
import { shallow } from "enzyme";

// test imports
import BigCalendar from "react-big-calendar";
import CalendarView from "../../../components/panels/components/CalendarView";
import MyMassagePanel from "../../../components/panels/MyMassagePanel";

beforeAll(() => {
  const mockedDate = new Date(0);
  global.Date = jest.fn(() => mockedDate);
  Date.now = jest.fn(() => 0);
});

afterAll(() => {
  jest.resetAllMocks();
});

test("renders content with correct props", () => {
  const testFunction = jest.fn();
  const testEvents = [
    {
      massage: {
        id: 1,
        date: new Date(0),
        ending: new Date(1000),
        masseuse: "test",
        client: null,
        facility: { id: 1, name: "test" }
      }
    }
  ];
  const wrapper = shallow(<MyMassagePanel events={testEvents} onCancel={testFunction} />);
  const calendar = wrapper.find(BigCalendar);

  expect(calendar.props().events).toBe(testEvents);
  expect(calendar.props().views).toEqual({ view: CalendarView });
  expect(calendar.props().onCancel).toBe(testFunction);
  expect(calendar.props().messages).toBe(wrapper.instance().localization);
  expect(calendar.props().titleAccessor).toBe(wrapper.instance().generateTitle);
  expect(testFunction).not.toHaveBeenCalled();

  expect(wrapper).toMatchSnapshot();
});
