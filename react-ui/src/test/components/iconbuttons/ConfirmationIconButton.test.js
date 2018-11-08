// react imports
import React from "react";
import { shallow } from "enzyme";

// test imports
import ConfirmationIconButton from "../../../components/iconbuttons/ConfirmationIconButton";
import ConfirmationModal from "../../../components/modals/ConfirmationModal";
import TooltipIconButton from "../../../components/iconbuttons/TooltipIconButton";

test("renders content with correct props", () => {
  const testFunction = jest.fn();
  const wrapper = shallow(<ConfirmationIconButton icon="trash" onConfirm={testFunction} dialogMessage="message" />);
  const button = wrapper.find(TooltipIconButton);

  button.props().onClick();

  expect(wrapper.instance().state.active).toBe(true);
  expect(testFunction).not.toHaveBeenCalled();

  const dialog = wrapper.find(ConfirmationModal);
  dialog.props().onConfirm();

  expect(wrapper.instance().state.active).toBe(false);
  expect(testFunction).toHaveBeenCalledTimes(1);
  expect(dialog.props().message).toEqual("message");
  expect(wrapper).toMatchSnapshot();
});
