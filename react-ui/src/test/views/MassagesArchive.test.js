// react imports
import React from "react";

// test imports
import { shallow } from "enzyme";
import moment from "moment";
import MassagesArchive from "../../views/MassagesArchive";
import TooltipButton from "../../components/buttons/TooltipButton";
import ConfirmationButton from "../../components/buttons/ConfirmationButton";
import CalendarPanel from "../../components/panels/CalendarPanel";
import Fetch from "../../util/Fetch";

// test mocks
jest.mock("../../util/Auth");
jest.mock("../../util/Fetch");

afterAll(() => {
  jest.resetAllMocks();
});

test("renders content correctly", () => {
  const wrapper = shallow(<MassagesArchive />);

  expect(wrapper).toMatchSnapshot();
});

test("properly changes state variables", () => {
  Fetch.delete = jest.fn((url, update) => {
    update();
  });
  const testMoment = moment().add(1, "days");
  const testMassages = [
    {
      id: 1,
      date: new Date(0),
      ending: new Date(1000),
      client: null,
      facility: { id: 1, name: "test" }
    }
  ];
  const wrapper = shallow(<MassagesArchive />);
  const selectButton = wrapper.find(TooltipButton);
  const deleteButtons = wrapper.find(ConfirmationButton);
  const panel = wrapper.find(CalendarPanel);

  wrapper.instance().setState({ loading: true });
  wrapper.instance().updateEvents(testMassages);
  expect(wrapper.instance().state.events[0].massage).toBe(testMassages[0]);
  expect(wrapper.instance().state.loading).toBe(false);

  expect(selectButton.props().active).toBe(true);
  selectButton.props().onClick();
  expect(wrapper.instance().state.selectEvents).toBe(false);

  expect(deleteButtons.get(0).props.disabled).toBe(true);
  deleteButtons.get(0).props.onConfirm();
  expect(Fetch.delete).toHaveBeenCalledTimes(1);
  deleteButtons.get(1).props.onConfirm();
  expect(Fetch.get).toHaveBeenCalledTimes(4);
  expect(Fetch.delete).toHaveBeenCalledTimes(1);
  expect(panel.props().selected).toEqual([]);
  expect(panel.props().allowEditation).toBe(false);
  panel.props().onDelete(1);
  expect(Fetch.delete).toHaveBeenCalledTimes(2);

  panel.props().onDateChange(testMoment.clone(), "month");
  expect(wrapper.instance().state.from).toEqual(
    testMoment
      .clone()
      .startOf("month")
      .subtract(37, "days")
  );
  expect(wrapper.instance().state.to).toEqual(
    testMoment
      .clone()
      .endOf("month")
      .add(37, "days")
  );
  panel.props().onDateChange(testMoment.clone(), "");
  expect(wrapper.instance().state.from).toEqual(
    testMoment
      .clone()
      .startOf("isoWeek")
      .subtract(7, "days")
  );
  expect(wrapper.instance().state.to).toEqual(testMoment.endOf("isoWeek").add(5, "days"));
  expect(wrapper.instance().state.loading).toBe(true);
  expect(wrapper.instance().state.selected).toEqual([]);

  panel.props().onSelect(wrapper.instance().state.events[0]);
  expect(wrapper.instance().state.selected[0]).toBe(wrapper.instance().state.events[0].massage);
  panel.props().onSelect(null);
  expect(wrapper.instance().state.selected).toEqual([]);
});
