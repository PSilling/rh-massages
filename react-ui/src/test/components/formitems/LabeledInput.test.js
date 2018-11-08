// react imports
import React from "react";
import { shallow } from "enzyme";

// test imports
import { Col, Input, Label, Tooltip } from "reactstrap";
import LabeledInput from "../../../components/formitems/LabeledInput";

test("renders content with correct props", () => {
  const testFunction = jest.fn();
  const wrapper = shallow(<LabeledInput onChange={testFunction} label="test" value="value" tooltip="tooltip" />);
  const col = wrapper.find(Col);
  const label = wrapper.find(Label);
  const input = wrapper.find(Input);
  const tooltip = wrapper.find(Tooltip);

  expect(testFunction).not.toHaveBeenCalled();

  input.props().onChange();

  expect(testFunction).toHaveBeenCalledTimes(1);

  expect(col.props().md).toEqual("12");
  expect(label.props().id).toEqual(tooltip.props().target);
  expect(label.props().for).toEqual(input.props().id);
  expect(label.props().children).toEqual("test");
  expect(input.props().value).toEqual("value");
  expect(tooltip.props().isOpen).toBe(false);
  expect(tooltip.props().children).toEqual("tooltip");
  expect(wrapper).toMatchSnapshot();
});
