// react imports
import React from "react";
import { shallow } from "enzyme";

// test imports
import ConfirmationButton from "../../../components/buttons/ConfirmationButton";
import TooltipButton from "../../../components/buttons/TooltipButton";
import ConfirmationModal from "../../../components/modals/ConfirmationModal";

test("renders content with correct props", () => {
  const testFunction = jest.fn();
  const wrapper = shallow(<ConfirmationButton onConfirm={testFunction} label="test" dialogMessage="message" />);
  const button = wrapper.find(TooltipButton);

  button.props().onClick();

  expect(testFunction).not.toHaveBeenCalled();
  expect(wrapper.instance().state.active).toBe(true);

  const dialog = wrapper.find(ConfirmationModal);
  dialog.props().onConfirm();

  expect(wrapper.instance().state.active).toBe(false);
  expect(testFunction).toHaveBeenCalledTimes(1);
  expect(button.props().label).toEqual("test");
  expect(button.props().tooltip).toEqual("Delete");
  expect(button.props().disabled).toBe(false);
  expect(dialog.props().message).toEqual("message");
  expect(wrapper).toMatchSnapshot();
});
