// react imports
import React from "react";
import { shallow } from "enzyme";

// test imports
import { Col, Label, Tooltip } from "reactstrap";
import Datetime from "react-datetime";
import moment from "moment";
import LabeledDatetime from "../../../components/formitems/LabeledDatetime";

test("renders content with correct props", () => {
  const testFunction = jest.fn();
  const wrapper = shallow(<LabeledDatetime onChange={testFunction} label="test" value={moment(1)} tooltip="tooltip" />);
  const col = wrapper.find(Col);
  const label = wrapper.find(Label);
  const datetime = wrapper.find(Datetime);
  const tooltip = wrapper.find(Tooltip);

  expect(testFunction).not.toHaveBeenCalled();

  datetime.props().onChange();

  expect(testFunction).toHaveBeenCalledTimes(1);

  expect(col.props().md).toEqual("12");
  expect(label.props().id).toEqual(tooltip.props().target);
  expect(label.props().children).toEqual("test");
  expect(datetime.props().value).toEqual(moment(1));
  expect(tooltip.props().isOpen).toBe(false);
  expect(tooltip.props().children).toEqual("tooltip");
  expect(wrapper).toMatchSnapshot();
});
