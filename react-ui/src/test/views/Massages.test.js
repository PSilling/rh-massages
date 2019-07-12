// react imports
import React from "react";

// test imports
import { shallow } from "enzyme";
import moment from "moment";
import Massages from "../../views/Massages";
import TooltipButton from "../../components/buttons/TooltipButton";
import ConfirmationButton from "../../components/buttons/ConfirmationButton";
import CalendarPanel from "../../components/panels/CalendarPanel";
import MassageBatchAddModal from "../../components/modals/MassageBatchAddModal";
import MassageModal from "../../components/modals/MassageModal";
import Tab from "../../components/navs/Tab";
import Fetch from "../../util/Fetch";
import Util from "../../util/Util";

// test mocks
jest.mock("../../util/Auth");
jest.mock("../../util/Fetch");
jest.mock("../../util/Util");

afterAll(() => {
  jest.resetAllMocks();
});

const dateNow = Date.now;

test("renders content correctly", () => {
  Date.now = jest.fn();
  const testFacilities = [{ id: 1, name: "test" }];
  const wrapper = shallow(<Massages />);

  expect(Fetch.tryWebSocketSend).toHaveBeenCalledTimes(2);
  expect(Fetch.send).toHaveBeenCalledTimes(2);

  expect(wrapper.find(Tab).length).toBe(0);
  wrapper.instance().setState({ facilities: testFacilities });
  expect(wrapper.find(Tab).length).toBe(1);

  expect(wrapper).toMatchSnapshot();
});

test("properly changes state variables", () => {
  Date.now = dateNow;
  Fetch.delete = jest.fn((url, update = () => {}) => {
    update();
  });
  const testMoment = moment().add(1, "days");
  const testFacilities = [{ id: 1, name: "test" }];
  const testMassages = [
    {
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
  ];
  const testEvent = {
    bgColor: "white",
    massage: testMassages[0]
  };
  const wrapper = shallow(<Massages />);

  expect(Fetch.get).toHaveBeenCalledTimes(4);
  wrapper.instance().setState({ facilities: testFacilities, massages: testMassages });
  wrapper.instance().getFacilities();
  expect(Fetch.get).toHaveBeenCalledTimes(5);
  expect(wrapper.instance().state.facilities).toEqual([]);
  expect(wrapper.instance().state.massages).toBe(testMassages);
  wrapper.instance().setState({ facilities: testFacilities });

  const tabs = wrapper.find(Tab);
  const tooltipButtons = wrapper.find(TooltipButton);
  const deleteButton = wrapper.find(ConfirmationButton);
  const addModal = wrapper.find(MassageBatchAddModal);
  const massageModal = wrapper.find(MassageModal);
  const panel = wrapper.find(CalendarPanel);

  wrapper.instance().setState({ loading: true });
  wrapper.instance().updateEvents(testMassages, 0);
  expect(wrapper.instance().state.events[0].massage).toBe(testMassages[0]);
  expect(wrapper.instance().state.massageMinutes).toBe(0);
  expect(wrapper.instance().state.loading).toBe(false);

  expect(wrapper.instance().state.activeEventTooltip).toBe(null);
  wrapper.instance().changeTooltipActive("testTooltip");
  expect(wrapper.instance().state.activeEventTooltip).toBe("testTooltip");
  wrapper.instance().changeTooltipActive(null);
  expect(wrapper.instance().state.activeEventTooltip).toBe(null);

  expect(tabs.length).toBe(1);
  expect(tabs.get(0).props.active).toBe(true);
  expect(tabs.get(0).props.label).toBe(testFacilities[0].name);
  tabs.get(0).props.onClick();
  expect(wrapper.instance().state.index).toBe(0);
  expect(wrapper.instance().state.loading).toBe(true);

  expect(tooltipButtons.get(1).props.active).toBe(false);
  tooltipButtons.get(1).props.onClick();
  expect(wrapper.instance().state.selectEvents).toBe(true);
  tooltipButtons.get(1).props.onClick();
  expect(wrapper.instance().state.selectEvents).toBe(false);
  expect(tooltipButtons.get(0).props.active).toBe(true);
  tooltipButtons.get(0).props.onClick();
  expect(wrapper.instance().state.showAll).toBe(false);

  expect(wrapper.instance().state.batchAddModalActive).toBe(false);
  expect(wrapper.instance().state.modalActive).toBe(false);
  expect(deleteButton.props().disabled).toBe(true);
  expect(addModal.props().facilityId).toBe(testFacilities[0].id);
  addModal.props().onToggle();
  massageModal.props().onToggle();
  expect(wrapper.instance().state.batchAddModalActive).toBe(true);
  expect(wrapper.instance().state.modalActive).toBe(true);

  deleteButton.props().onConfirm();
  expect(Fetch.delete).toHaveBeenCalledTimes(1);
  panel.props().onDelete(1);
  expect(Fetch.delete).toHaveBeenCalledTimes(2);
  panel.props().onAdd({ start: testMoment, end: testMoment });
  expect(Util.notify).not.toHaveBeenCalled();
  panel.props().onEdit(testMassages[0]);
  expect(wrapper.instance().state.editMassage).toBe(testMassages[0]);
  panel.props().onAssign(testMassages[0]);
  expect(Fetch.put).toHaveBeenCalledTimes(1);
  panel.props().onCancel(testMassages[0]);
  expect(Fetch.put).toHaveBeenCalledTimes(2);
  panel.props().onSelect(testEvent);
  expect(wrapper.instance().state.selected[0]).toBe(testMassages[0]);
  panel.props().onSelect(null);
  expect(wrapper.instance().state.selected).toEqual([]);

  expect(wrapper.instance().state.loading).toBe(true);
  expect(wrapper.instance().state.selected).toEqual([]);
});
