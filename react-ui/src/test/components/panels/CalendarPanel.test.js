// react imports
import React from "react";

// test imports
import { shallow } from "enzyme";
import BigCalendar from "react-big-calendar";
import Auth from "../../../util/Auth";
import CalendarPanel from "../../../components/panels/CalendarPanel";
import CalendarToolbar from "../../../components/util/CalendarToolbar";
import MassageEventModal from "../../../components/modals/MassageEventModal";

// test mocks
jest.mock("../../../util/Auth");

beforeAll(() => {
  Date.now = jest.fn(() => 0);
});

afterAll(() => {
  jest.resetAllMocks();
});

test("renders content with correct props and funcionality", () => {
  const testAssignFunction = jest.fn();
  const testCancelFunction = jest.fn();
  const testAddFunction = jest.fn();
  const testEditFunction = jest.fn();
  const testDeleteFunction = jest.fn();
  const testDateChangeFunction = jest.fn();
  const testSelectFunction = jest.fn();
  const testEvents = [
    {
      bgColor: "white",
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
      bgColor: "black",
      massage: {
        id: 2,
        date: new Date(1000),
        ending: new Date(2000),
        masseuse: {
          sub: "m-sub2",
          name: "Masseuse2",
          surname: "Test2",
          email: "test2@masseuse.org",
          subscribed: true,
          masseur: true
        },
        client: { sub: "test" },
        facility: { id: 1, name: "test" }
      }
    },
    {
      bgColor: "yellow",
      massage: {
        id: 3,
        date: new Date(2000),
        ending: new Date(3000),
        masseuse: {
          sub: "m-sub3",
          name: "Masseuse3",
          surname: "Test3",
          email: "test3@masseuse.org",
          subscribed: false,
          masseur: true
        },
        client: { sub: "test2" },
        facility: { id: 1, name: "test" }
      }
    }
  ];
  const wrapper = shallow(
    <CalendarPanel
      events={testEvents}
      selected={[]}
      selectEvents
      massageMinutes={0}
      onAssign={testAssignFunction}
      onCancel={testCancelFunction}
      onAdd={testAddFunction}
      onEdit={testEditFunction}
      onDelete={testDeleteFunction}
      onDateChange={testDateChangeFunction}
      onSelect={testSelectFunction}
      onSelectDay={testSelectFunction}
    />
  );

  const toolbar = wrapper.find(CalendarToolbar);
  const calendar = wrapper.find(BigCalendar);

  expect(toolbar.props().leftDisabled).toBe(false);
  expect(toolbar.props().rightDisabled).toBe(false);
  wrapper.instance().changeDate(false);
  expect(testDateChangeFunction).toHaveBeenCalledTimes(1);
  wrapper.instance().changeDate(true);
  expect(testDateChangeFunction).toHaveBeenCalledTimes(2);
  wrapper.instance().changeView("month");
  expect(testDateChangeFunction).toHaveBeenCalledTimes(3);
  expect(testDateChangeFunction).toHaveBeenLastCalledWith(wrapper.instance().state.date, "month");

  expect(calendar.props().messages).toBe(wrapper.instance().localization);
  expect(calendar.props().events).toBe(testEvents);
  expect(calendar.props().views).toEqual(["work_week", "month"]);
  calendar.props().onView(null);
  expect(testDateChangeFunction).toHaveBeenCalledTimes(4);
  expect(calendar.props().startAccessor(testEvents[0])).toEqual(testEvents[0].massage.date);
  expect(calendar.props().endAccessor(testEvents[0])).toEqual(testEvents[0].massage.ending);
  expect(calendar.props().onSelectSlot).toBe(testAddFunction);

  wrapper.instance().configureModalActions(testEvents[0]);
  expect(wrapper.instance().state.action).toBe("assign");
  wrapper.instance().configureModalActions(testEvents[1]);
  expect(wrapper.instance().state.action).toBe("cancel");
  wrapper.instance().configureModalActions(testEvents[2]);
  expect(wrapper.instance().state.action).toBe("cancel");
  Auth.isAdmin = jest.fn(() => false);
  wrapper.instance().configureModalActions(testEvents[2]);
  expect(wrapper.instance().state.action).toBe("none");

  const modal = wrapper.find(MassageEventModal);

  expect(modal.props().event).toBe(testEvents[2]);
  expect(modal.props().label).toBe("none");
  expect(modal.props().disabled).toBe(false);
  expect(modal.props().allowEditation).toBe(true);
  modal.props().onEdit();
  modal.props().onDelete();
  expect(testEditFunction).toHaveBeenLastCalledWith(testEvents[2].massage);
  expect(testDeleteFunction).toHaveBeenLastCalledWith(testEvents[2].massage.id);
  expect(modal.props().onClose).toBe(wrapper.instance().handleToggle);

  wrapper.instance().setState({ date: new Date(0) });
  testDateChangeFunction.mockClear();

  expect(wrapper).toMatchSnapshot();
});
