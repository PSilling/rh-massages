// react imports
import React from "react";
import { shallow } from "enzyme";

// test imports
import { Button, CardHeader, CardText } from "reactstrap";
import moment from "moment";
import ConfirmationModal from "../../../components/modals/ConfirmationModal";
import MyMassagePanel from "../../../components/panels/MyMassagePanel";
import _t from "../../../util/Translations";

// test mocks
jest.mock("../../../util/Util");

afterEach(() => {
  jest.resetAllMocks();
});

test("renders content with correct props", () => {
  const testFunction = jest.fn();
  const testMassage = {
    id: 1,
    date: new Date(0),
    ending: new Date(1000),
    client: null,
    facility: { id: 1, name: "test" }
  };
  const wrapper = shallow(<MyMassagePanel massage={testMassage} getCallback={testFunction} />);
  const texts = wrapper.find(CardText);
  const header = wrapper.find(CardHeader);
  const button = wrapper.find(Button);

  expect(header.props().children[0]).toEqual(moment(testMassage.date).format("ddd L"));
  expect(texts.get(0).props.children).toEqual(`${_t.translate("Facility")}: ${testMassage.facility.name}`);
  expect(texts.get(1).props.children).toEqual(`${_t.translate("Masseur/Masseuse")}: ${testMassage.masseuse}`);
  expect(texts.get(2).props.children).toEqual(
    `${_t.translate("Time")}: ${moment(testMassage.date).format("HH:mm")}–${moment(testMassage.ending).format("HH:mm")}`
  );
  expect(testFunction).not.toHaveBeenCalled();

  button.props().onClick();

  const modal = wrapper.find(ConfirmationModal);

  modal.props().onConfirm();

  expect(testFunction).toHaveBeenCalledTimes(1);
  expect(wrapper).toMatchSnapshot();
});
