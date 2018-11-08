// react imports
import React from "react";
import { shallow } from "enzyme";

// test imports
import { Tooltip } from "reactstrap";
import TooltipGroup from "../../../components/util/TooltipGroup";

test("renders content with correct props", () => {
  const testLabels = ["test1", "test2"];
  const testTargets = ["target1", "target2"];
  const wrapper = shallow(<TooltipGroup labels={testLabels} targets={testTargets} />);
  const tooltips = wrapper.find(Tooltip);

  expect(tooltips.get(1).props.isOpen).toBe(false);
  expect(tooltips.get(1).props.children).toEqual(testLabels[1]);
  expect(tooltips.get(0).props.target).toEqual(testTargets[0]);
  expect(wrapper).toMatchSnapshot();
});
