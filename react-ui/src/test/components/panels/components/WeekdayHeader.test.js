// react imports
import React from "react";
import { shallow } from "enzyme";

// test imports
import { Header } from "../../../../components/panels/components/WeekdayHeader";

test("renders content with correct props", () => {
  const testFunction = jest.fn();
  const testDate = new Date(0);
  const wrapper = shallow(<Header active label="testHeader" date={testDate} onClick={testFunction} />);
  const spans = wrapper.find("span");

  expect(spans.length).toBe(1);
  expect(spans.props().children).toEqual("testHeader");
  spans.props().onClick();
  expect(testFunction).toHaveBeenCalledTimes(1);
  expect(testFunction).toHaveBeenLastCalledWith(testDate);

  expect(wrapper).toMatchSnapshot();
});
