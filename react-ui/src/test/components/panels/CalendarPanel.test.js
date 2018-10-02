// react imports
import React from 'react';

// test imports
import Auth from '../../../util/Auth';
import BigCalendar from 'react-big-calendar';
import CalendarPanel from '../../../components/panels/CalendarPanel';
import CalendarToolbar from '../../../components/util/CalendarToolbar';
import MassageEventModal from '../../../components/modals/MassageEventModal';
import moment from 'moment';

// test mocks
jest.mock('../../../util/Auth');

afterEach(() => {
  jest.resetAllMocks();
});

test('renders content with correct props and funcionality', () => {
  const testAssignFunction = jest.fn(),
        testCancelFunction = jest.fn(),
        testAddFunction = jest.fn(),
        testEditFunction = jest.fn(),
        testDeleteFunction = jest.fn(),
        testDateChangeFunction = jest.fn(),
        testSelectFunction = jest.fn(),
        testEvents = [
          {
            bgColor: "white",
            massage : {
              id: 1,
              date: new Date(0),
              ending: new Date(1000),
              masseuse: "test",
              client: null,
              facility: { id: 1, name: "test" }
            }
          },
          {
            bgColor: "black",
            massage : {
              id: 2,
              date: new Date(1000),
              ending: new Date(2000),
              client: { sub: "test" },
              facility: { id: 1, name: "test" }
            }
          },
          {
            bgColor: "yellow",
            massage : {
              id: 3,
              date: new Date(2000),
              ending: new Date(3000),
              client: { sub: "test2" },
              facility: { id: 1, name: "test" }
            }
          }
        ],
        wrapper = shallow(
          <CalendarPanel
            events={testEvents}
            selected={[]}
            selectEvents={true}
            massageMinutes={0}
            onAssign={testAssignFunction}
            onCancel={testCancelFunction}
            onAdd={testAddFunction}
            onEdit={testEditFunction}
            onDelete={testDeleteFunction}
            onDateChange={testDateChangeFunction}
            onSelect={testSelectFunction}
          />
        );

  let toolbar = wrapper.find(CalendarToolbar),
      calendar = wrapper.find(BigCalendar);

  expect(toolbar.props().leftDisabled).toBe(true);
  expect(toolbar.props().rightDisabled).toBe(false);
  wrapper.instance().changeDate(false);
  expect(testDateChangeFunction).toHaveBeenCalledTimes(1);
  wrapper.instance().changeDate(true);
  expect(testDateChangeFunction).toHaveBeenCalledTimes(2);
  wrapper.instance().changeView("month");
  expect(testDateChangeFunction).toHaveBeenCalledTimes(3);
  expect(testDateChangeFunction).toHaveBeenLastCalledWith(
    moment(wrapper.instance().state.date), "month"
  );

  expect(calendar.props().messages).toBe(wrapper.instance().localization);
  expect(calendar.props().events).toBe(testEvents);
  expect(calendar.props().views).toEqual(['work_week', 'month']);
  calendar.props().onView(null);
  calendar.props().onNavigate(null, null);
  expect(testDateChangeFunction).toHaveBeenCalledTimes(5);
  expect(calendar.props().titleAccessor(testEvents[0])).toBe(testEvents[0].massage.masseuse);
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

  let modal = wrapper.find(MassageEventModal);

  expect(modal.props().event).toBe(testEvents[2]);
  expect(modal.props().label).toBe("none");
  expect(modal.props().disabled).toBe(false);
  expect(modal.props().allowEditation).toBe(true);
  modal.props().onEdit();
  modal.props().onDelete();
  expect(testEditFunction).toHaveBeenLastCalledWith(testEvents[2].massage);
  expect(testDeleteFunction).toHaveBeenLastCalledWith(testEvents[2].massage.id);
  expect(modal.props().onClose).toBe(wrapper.instance().handleToggle);

  expect(wrapper).toMatchSnapshot();
});
