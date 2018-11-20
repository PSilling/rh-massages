// react imports
import React from "react";
import { shallow } from "enzyme";

// test imports
import CalendarView from "../../../../components/panels/components/CalendarView";
import EventRow from "../../../../components/panels/components/EventRow";

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
    },
    {
      massage: {
        id: 2,
        date: new Date(1000),
        ending: new Date(2000),
        client: { sub: "test" },
        facility: { id: 1, name: "test" }
      }
    }
  ];
  const testLocalizer = {
    messages: {
      massage: {
        date: "date",
        time: "time",
        event: "event"
      }
    }
  };
  const wrapper = shallow(<CalendarView events={testEvents} localizer={testLocalizer} onCancel={testFunction} />);
  const rows = wrapper.find(EventRow);

  expect(rows.get(0).props.event).toBe(testEvents[0]);
  expect(rows.get(1).props.event).toBe(testEvents[1]);
  expect(rows.get(0).props.onCancel).toBe(testFunction);
  expect(rows.get(1).props.onCancel).toBe(testFunction);
  expect(testFunction).not.toHaveBeenCalled();

  expect(wrapper).toMatchSnapshot();
});
