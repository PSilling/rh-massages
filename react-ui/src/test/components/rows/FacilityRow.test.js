// react imports
import React from "react";
import { shallow } from "enzyme";

// test imports
import ConfirmationIconButton from "../../../components/iconbuttons/ConfirmationIconButton";
import FacilityRow from "../../../components/rows/FacilityRow";
import TooltipIconButton from "../../../components/iconbuttons/TooltipIconButton";

test("renders content with correct props", () => {
  const testEditFunction = jest.fn();
  const testDeleteFunction = jest.fn();
  const wrapper = shallow(
    <FacilityRow facility={{ name: "test" }} onEdit={testEditFunction} onDelete={testDeleteFunction} />
  );
  const cells = wrapper.find("td");
  const editButton = wrapper.find(TooltipIconButton);
  const deleteButton = wrapper.find(ConfirmationIconButton);

  expect(cells.get(0).props.children).toEqual("test");
  expect(editButton.props().onClick).toBe(testEditFunction);
  expect(deleteButton.props().onConfirm).toBe(testDeleteFunction);
  expect(wrapper).toMatchSnapshot();
});
