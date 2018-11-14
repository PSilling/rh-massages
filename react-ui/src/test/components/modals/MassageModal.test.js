// react imports
import React from "react";
import { shallow } from "enzyme";

// test imports
import moment from "moment";
import LabeledDatetime from "../../../components/formitems/LabeledDatetime";
import LabeledInput from "../../../components/formitems/LabeledInput";
import MassageModal from "../../../components/modals/MassageModal";
import ModalActions from "../../../components/buttons/ModalActions";
import TooltipIconButton from "../../../components/iconbuttons/TooltipIconButton";
import _t from "../../../util/Translations";

// test mocks
jest.mock("../../../util/Fetch");

beforeAll(() => {
  Date.now = jest.fn(() => 0);
});

afterAll(() => {
  jest.resetAllMocks();
});

test("renders inside content with correct props", () => {
  const testGetFunction = jest.fn();
  const testToggleFunction = jest.fn();
  const testMasseuses = ["test"];
  const wrapper = shallow(
    <MassageModal
      active
      massage={null}
      facilityId={1}
      masseuses={testMasseuses}
      getCallback={testGetFunction}
      onToggle={testToggleFunction}
      withPortal={false}
    />
  );
  const button = wrapper.find(TooltipIconButton);
  const actions = wrapper.find(ModalActions);
  const heading = wrapper.find("h3");
  const input = wrapper.find(LabeledInput);
  const datetimes = wrapper.find(LabeledDatetime);

  expect(testToggleFunction).not.toHaveBeenCalled();
  expect(testGetFunction).not.toHaveBeenCalled();
  expect(button.props().onClick).toBe(testToggleFunction);
  expect(actions.props().onProceed).toBe(wrapper.instance().addMassage);
  expect(actions.props().onClose).toBe(testToggleFunction);
  expect(heading.props().children).toEqual(_t.translate("New Massage"));
  expect(input.props().value).toBe("");
  expect(input.props().options).toBe(testMasseuses);
  expect(datetimes.get(0).props.value).toEqual(moment("00:30", "HH:mm"));
  expect(datetimes.get(1).props.value).toEqual(moment().add(1, "hours"));
  expect(wrapper).toMatchSnapshot();
});

test("switches to edit mode when a Massage is given", () => {
  const testGetFunction = jest.fn();
  const testToggleFunction = jest.fn();
  const testMassage = {
    id: 1,
    date: new Date(0),
    ending: new Date(1000),
    masseuse: "test",
    client: null,
    facility: { id: 1, name: "test" }
  };
  const wrapper = shallow(
    <MassageModal
      active
      massage={testMassage}
      facilityId={1}
      masseuses={[]}
      getCallback={testGetFunction}
      onToggle={testToggleFunction}
      withPortal={false}
    />
  );
  wrapper.instance().setState({
    date: testMassage.date,
    time: moment.utc(moment(testMassage.ending).diff(moment(testMassage.date))),
    masseuse: testMassage.masseuse,
    massage: testMassage
  });

  const actions = wrapper.find(ModalActions);
  const heading = wrapper.find("h3");
  const input = wrapper.find(LabeledInput);
  const datetimes = wrapper.find(LabeledDatetime);

  expect(testToggleFunction).not.toHaveBeenCalled();
  expect(testGetFunction).not.toHaveBeenCalled();
  expect(heading.props().children).toEqual(_t.translate("Edit Massage"));
  expect(actions.props().primaryLabel).toBe(_t.translate("Edit"));
  expect(actions.props().onProceed).toBe(wrapper.instance().editMassage);
  expect(input.props().value).toBe("test");
  expect(datetimes.get(0).props.value).toEqual(moment.utc(moment(testMassage.ending).diff(moment(testMassage.date))));
  expect(datetimes.get(1).props.value).not.toBe(null);
});
