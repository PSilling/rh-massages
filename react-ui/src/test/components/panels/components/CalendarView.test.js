// react imports
import React from "react";
import { shallow } from "enzyme";

// test imports
import CalendarView from "../../../../components/panels/components/CalendarView";
import EventRow from "../../../../components/panels/components/EventRow";
import PrintModal from "../../../../components/modals/PrintModal";

test("renders content with correct props", () => {
  const testFunction = jest.fn();
  const testEvents = [
    {
      massage: {
        id: 1,
        date: new Date(0),
        ending: new Date(1000),
        masseuse: {
          sub: "m-sub",
          name: "Masseuse",
          surname: "Test",
          email: "test@masseuse.org",
          subscribed: false,
          masseur: true
        },
        client: null,
        facility: { id: 1, name: "test" }
      }
    },
    {
      massage: {
        id: 2,
        date: new Date(1000),
        ending: new Date(2000),
        masseuse: {
          sub: "m-sub2",
          name: "Masseuse",
          surname: "Test2",
          email: "test2@masseuse.org",
          subscribed: true,
          masseur: true
        },
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
  const printModal = wrapper.find(PrintModal);

  expect(rows.get(0).props.event).toBe(testEvents[0]);
  expect(rows.get(1).props.event).toBe(testEvents[1]);
  expect(rows.get(0).props.onCancel).toBe(testFunction);
  expect(rows.get(1).props.onCancel).toBe(testFunction);
  expect(testFunction).not.toHaveBeenCalled();

  expect(printModal.props().events).toBe(testEvents);
  expect(printModal.props().onPrint).toBe(wrapper.instance().setPrintMassages);

  expect(wrapper).toMatchSnapshot();
});

test("renders print content correctly", () => {
  Date.now = jest.fn();
  const testFunction = jest.fn();
  const testEvents = [
    {
      massage: {
        id: 1,
        date: new Date(0),
        ending: new Date(1000),
        masseuse: {
          sub: "m-sub",
          name: "Masseuse",
          surname: "Test",
          email: "test@masseuse.org",
          subscribed: false,
          masseur: true
        },
        client: null,
        facility: { id: 1, name: "test" }
      }
    },
    {
      massage: {
        id: 2,
        date: new Date(1000),
        ending: new Date(2000),
        masseuse: {
          sub: "m-sub2",
          name: "Masseuse",
          surname: "Test2",
          email: "test2@masseuse.org",
          subscribed: true,
          masseur: true
        },
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
  const testMassages = [
    {
      id: 2,
      date: new Date(1000),
      ending: new Date(2000),
      masseuse: {
        sub: "m-sub2",
        name: "Masseuse",
        surname: "Test2",
        email: "test2@masseuse.org",
        subscribed: true,
        masseur: true
      },
      client: { sub: "test" },
      facility: { id: 1, name: "test" }
    }
  ];
  const wrapper = shallow(<CalendarView events={testEvents} localizer={testLocalizer} onCancel={testFunction} />);

  expect(wrapper.find(".print-only").length).toBe(0);
  wrapper.instance().setState({ printMassages: testMassages });
  expect(wrapper.find(".print-only").length).toBe(1);

  expect(wrapper).toMatchSnapshot();
});
