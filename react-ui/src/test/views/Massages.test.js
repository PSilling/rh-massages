// react imports
import React from 'react';

// test imports
import Massages from '../../views/Massages';
import BatchDeleteButton from '../../components/buttons/BatchDeleteButton';
import CalendarPanel from '../../components/panels/CalendarPanel';
import MassageBatchAddModal from '../../components/modals/MassageBatchAddModal';
import MassageBatchEditModal from '../../components/modals/MassageBatchEditModal';
import MassageCopyModal from '../../components/modals/MassageCopyModal';
import MassageFilter from '../../components/util/MassageFilter';
import MassageModal from '../../components/modals/MassageModal';
import PrintModal from '../../components/modals/PrintModal';
import Tab from '../../components/navs/Tab';
import moment from 'moment';
import Util from '../../util/Util';

// test mocks
jest.mock('../../util/Auth');
jest.mock('../../util/Util');

afterAll(() => {
  jest.resetAllMocks();
});

var dateNow = Date.now;

test('renders content correctly', () => {
  Date.now = jest.fn();
  const testFacilities = [{ id: 1, name: "test" }],
        wrapper = shallow(<Massages />);

  expect(wrapper.find(Tab).length).toBe(0);
  wrapper.instance().setState({ facilities: testFacilities });
  expect(wrapper.find(Tab).length).toBe(1);

  expect(wrapper).toMatchSnapshot();
});

test('renders print content correctly', () => {
  Date.now = jest.fn();
  const testMassages = [{
          id: 1,
          date: new Date(0),
          ending: new Date(1000),
          client: null,
          facility: { id: 1, name: "test" }
        }],
        wrapper = shallow(<Massages />);

  expect(wrapper.find('.print-only').length).toBe(0);
  wrapper.instance().setState({ printMassages: testMassages });
  expect(wrapper.find('.print-only').length).toBe(1);

  expect(wrapper).toMatchSnapshot();
});

test('properly changes state variables', () => {
  Date.now = dateNow;
  Util.delete = jest.fn((url, update, notify = true) => { update(); });
  const testMoment = moment().add(1, 'days'),
        testFacilities = [{ id: 1, name: "test" }],
        testMassages = [{
          id: 1,
          date: new Date(0),
          ending: new Date(1000),
          client: null,
          facility: { id: 1, name: "test" }
        }],
        testEvent = {
          bgColor: "white",
          massage : testMassages[0]
        },
        wrapper = shallow(<Massages />);

  expect(Util.get).toHaveBeenCalledTimes(3);
  wrapper.instance().setState({ facilities: testFacilities, massages: testMassages });
  wrapper.instance().getFacilities();
  expect(Util.get).toHaveBeenCalledTimes(4);
  expect(wrapper.instance().state.facilities).toEqual([]);
  expect(wrapper.instance().state.massages).toBe(testMassages);
  wrapper.instance().setState({ facilities: testFacilities });

  let filter = wrapper.find(MassageFilter),
      tabs = wrapper.find(Tab),
      copyModal = wrapper.find(MassageCopyModal),
      editModal = wrapper.find(MassageBatchEditModal),
      deleteButton = wrapper.find(BatchDeleteButton),
      printModal = wrapper.find(PrintModal),
      addModal = wrapper.find(MassageBatchAddModal),
      massageModal = wrapper.find(MassageModal),
      panel = wrapper.find(CalendarPanel);

  wrapper.instance().setState({ loading: true });
  wrapper.instance().updateEvents(testMassages, 0);
  expect(wrapper.instance().state.events[0].massage).toBe(testMassages[0]);
  expect(wrapper.instance().state.massageMinutes).toBe(0);
  expect(wrapper.instance().state.loading).toBe(false);

  filter.props().onFreeCheck({ target: { checked: true } });
  expect(wrapper.instance().state.freeOnly).toBe(true);
  filter.props().onSelectCheck({ target: { checked: true } });
  expect(wrapper.instance().state.selectEvents).toBe(true);
  filter.props().onFilterChange({ target: { value: "test" } });
  expect(wrapper.instance().state.search).toBe("test");

  expect(tabs.length).toBe(1);
  expect(tabs.get(0).props.active).toBe(true);
  expect(tabs.get(0).props.label).toBe(testFacilities[0].name);
  tabs.get(0).props.onClick();
  expect(wrapper.instance().state.index).toBe(0);
  expect(wrapper.instance().state.loading).toBe(true);

  expect(wrapper.instance().state.copyModalActive).toBe(false);
  expect(wrapper.instance().state.batchEditModalActive).toBe(false);
  expect(wrapper.instance().state.batchAddModalActive).toBe(false);
  expect(wrapper.instance().state.modalActive).toBe(false);
  expect(copyModal.props().active).toBe(false);
  expect(deleteButton.props().disabled).toBe(true);
  expect(editModal.props().massages).toEqual([]);
  expect(printModal.props().masseuses).toEqual([]);
  expect(addModal.props().facilityId).toBe(testFacilities[0].id);
  expect(massageModal.props().getCallback).toBe(wrapper.instance().getMassages);
  copyModal.props().onToggle();
  editModal.props().onToggle();
  addModal.props().onToggle();
  massageModal.props().onToggle();
  expect(wrapper.instance().state.copyModalActive).toBe(true);
  expect(wrapper.instance().state.batchEditModalActive).toBe(true);
  expect(wrapper.instance().state.batchAddModalActive).toBe(true);
  expect(wrapper.instance().state.modalActive).toBe(true);
  printModal.props().onPrint(testMassages);
  expect(wrapper.instance().state.printMassages).toBe(testMassages);
  expect(wrapper.instance().createPrintRows().length).toBe(1);

  deleteButton.props().onDelete();
  expect(Util.delete).toHaveBeenCalledTimes(1);
  panel.props().onDelete(1);
  expect(Util.delete).toHaveBeenCalledTimes(2);
  panel.props().onAdd({ start: testMoment, end: testMoment });
  expect(Util.notify).not.toHaveBeenCalled();
  panel.props().onEdit(testMassages[0]);
  expect(wrapper.instance().state.editMassage).toBe(testMassages[0]);
  panel.props().onAssign(testMassages[0]);
  expect(Util.put).toHaveBeenCalledTimes(1);
  panel.props().onCancel(testMassages[0]);
  expect(Util.put).toHaveBeenCalledTimes(2);
  panel.props().onSelect(testEvent);
  expect(wrapper.instance().state.selected[0]).toBe(testMassages[0]);
  panel.props().onSelect(null);
  expect(wrapper.instance().state.selected).toEqual([]);

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
});
