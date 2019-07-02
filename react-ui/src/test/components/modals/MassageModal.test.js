// react imports
import React from "react";
import { shallow } from "enzyme";

// test imports
import moment from "moment";
import LabeledDatetime from "../../../components/formitems/LabeledDatetime";
import MassageModal from "../../../components/modals/MassageModal";
import ModalActions from "../../../components/buttons/ModalActions";
import TooltipButton from "../../../components/buttons/TooltipButton";

import _t from "../../../util/Translations";
// test mocks
jest.mock("../../../util/Auth");
jest.mock("../../../util/Fetch");

beforeAll(() => {
  Date.now = jest.fn(() => 0);
});

afterAll(() => {
  jest.resetAllMocks();
});

test("renders inside content with correct props", () => {
  const testToggleFunction = jest.fn();
  const testMasseuses = [
    {
      sub: "m-sub",
      name: "Masseuse",
      surname: "Test",
      email: "test@masseuse.org",
      subscribed: false,
      masseur: true
    }
  ];
  const testMasseuseNames = ["Masseuse Test"];
  const wrapper = shallow(
    <MassageModal
      active
      massage={null}
      facilityId={1}
      masseuses={testMasseuses}
      masseuseNames={testMasseuseNames}
      onToggle={testToggleFunction}
      withPortal={false}
    />
  );
  const button = wrapper.find(TooltipButton);
  const actions = wrapper.find(ModalActions);
  const heading = wrapper.find("h3");
  const datetimes = wrapper.find(LabeledDatetime);

  expect(testToggleFunction).not.toHaveBeenCalled();
  expect(button.props().onClick).toBe(testToggleFunction);
  expect(actions.props().onProceed).toBe(wrapper.instance().addMassage);
  expect(actions.props().onClose).toBe(testToggleFunction);
  expect(heading.props().children).toEqual(_t.translate("New massage"));
  expect(datetimes.get(0).props.value).toEqual(moment("00:30", "H:mm"));
  expect(datetimes.get(1).props.value).toEqual(moment().add(1, "hours"));
  expect(wrapper).toMatchSnapshot();
});

test("switches to edit mode when a Massage is given", () => {
  const testToggleFunction = jest.fn();
  const testMassage = {
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
  };
  const wrapper = shallow(
    <MassageModal active massage={testMassage} facilityId={1} onToggle={testToggleFunction} withPortal={false} />
  );
  wrapper.instance().setState({
    date: testMassage.date,
    time: moment.utc(moment(testMassage.ending).diff(moment(testMassage.date))),
    masseuse: testMassage.masseuse,
    massage: testMassage
  });

  const actions = wrapper.find(ModalActions);
  const heading = wrapper.find("h3");
  const datetimes = wrapper.find(LabeledDatetime);

  expect(testToggleFunction).not.toHaveBeenCalled();
  expect(heading.props().children).toEqual(_t.translate("Edit massage"));
  expect(actions.props().primaryLabel).toBe(_t.translate("Edit"));
  expect(actions.props().onProceed).toBe(wrapper.instance().editMassage);
  expect(datetimes.get(0).props.value).toEqual(moment.utc(moment(testMassage.ending).diff(moment(testMassage.date))));
  expect(datetimes.get(1).props.value).not.toBe(null);
});
