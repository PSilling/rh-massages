// react imports
import React from "react";
import { shallow } from "enzyme";

// test imports
import MassageEventModal from "../../../../components/modals/MassageEventModal";
import EventRow from "../../../../components/panels/components/EventRow";

test("renders content with correct props", () => {
  const testFunction = jest.fn();
  const testEvent = {
    massage: {
      id: 1,
      date: new Date(0),
      ending: new Date(1000),
      masseuse: "test",
      client: null,
      facility: { id: 1, name: "test" }
    }
  };
  const wrapper = shallow(<EventRow event={testEvent} onCancel={testFunction} />);
  const strongButton = wrapper.find("strong");
  let modals = wrapper.find(MassageEventModal);

  expect(modals.length).toBe(0);
  strongButton.props().onClick();
  modals = wrapper.find(MassageEventModal);
  expect(modals.length).toBe(1);
  expect(modals.props().event).toBe(testEvent);
  expect(testFunction).not.toHaveBeenCalled();

  modals.props().onConfirm();
  modals = wrapper.find(MassageEventModal);
  expect(modals.length).toBe(0);
  expect(testFunction).toHaveBeenCalledTimes(1);

  expect(wrapper).toMatchSnapshot();
});
