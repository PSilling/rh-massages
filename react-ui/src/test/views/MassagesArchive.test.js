// react imports
import React from 'react';

// test imports
import MassagesArchive from '../../views/MassagesArchive';
import BatchDeleteButton from '../../components/buttons/BatchDeleteButton';
import CalendarPanel from '../../components/panels/CalendarPanel';
import MassageFilter from '../../components/util/MassageFilter';
import moment from 'moment';
import Util from '../../util/Util';

// test mocks
jest.mock('../../util/Auth');
jest.mock('../../util/Util');

afterAll(() => {
  jest.resetAllMocks();
});

test('renders content correctly', () => {
  const wrapper = shallow(<MassagesArchive />);

  expect(wrapper).toMatchSnapshot();
});

test('properly changes state variables', () => {
  Util.delete = jest.fn((url, update, notify = true) => { update(); });
  const testMoment = moment().add(1, 'days'),
        testMassages = [{
          id: 1,
          date: new Date(0),
          ending: new Date(1000),
          client: null,
          facility: { id: 1, name: "test" }
        }],
        wrapper = shallow(<MassagesArchive />);

  let filter = wrapper.find(MassageFilter),
      buttons = wrapper.find(BatchDeleteButton),
      panel = wrapper.find(CalendarPanel);

  wrapper.instance().setState({ loading: true });
  wrapper.instance().updateEvents(testMassages);
  expect(wrapper.instance().state.events[0].massage).toBe(testMassages[0]);
  expect(wrapper.instance().state.loading).toBe(false);

  filter.props().onFreeCheck({ target: { checked: true } });
  expect(wrapper.instance().state.freeOnly).toBe(true);
  filter.props().onSelectCheck({ target: { checked: true } });
  expect(wrapper.instance().state.selectEvents).toBe(true);
  filter.props().onFilterChange({ target: { value: "test" } });
  expect(wrapper.instance().state.search).toBe("test");

  expect(buttons.get(0).props.disabled).toBe(true);
  buttons.get(0).props.onDelete();
  expect(Util.delete).toHaveBeenCalledTimes(1);
  buttons.get(1).props.onDelete();
  expect(Util.get).toHaveBeenCalledTimes(4);
  expect(Util.delete).toHaveBeenCalledTimes(1);
  expect(panel.props().selected).toEqual([]);
  expect(panel.props().allowEditation).toBe(false);
  panel.props().onDelete(1);
  expect(Util.delete).toHaveBeenCalledTimes(2);

  panel.props().onDateChange(testMoment.clone(), 'month');
  expect(wrapper.instance().state.from).toEqual(
    testMoment.clone().startOf('month').subtract(37, 'days')
  );
  expect(wrapper.instance().state.to).toEqual(
    testMoment.clone().endOf('month').add(37, 'days')
  );
  panel.props().onDateChange(testMoment.clone(), '');
  expect(wrapper.instance().state.from).toEqual(
    testMoment.clone().startOf('isoWeek').subtract(7, 'days')
  );
  expect(wrapper.instance().state.to).toEqual(
    testMoment.endOf('isoWeek').add(5, 'days')
  );
  expect(wrapper.instance().state.loading).toBe(true);
  expect(wrapper.instance().state.selected).toEqual([]);

  panel.props().onSelect(wrapper.instance().state.events[0]);
  expect(wrapper.instance().state.selected[0]).toBe(
    wrapper.instance().state.events[0].massage
  );
  panel.props().onSelect(null);
  expect(wrapper.instance().state.selected).toEqual([]);
});
