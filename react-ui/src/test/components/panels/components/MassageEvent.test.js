// react imports
import React from "react";
import { shallow } from "enzyme";

// test imports
import MassageEvent from "../../../../components/panels/components/MassageEvent";

test("renders content with correct props", () => {
  const testEvent = {
    massage: {
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
    }
  };
  const wrapper = shallow(<MassageEvent event={testEvent} view="work_week" />);
  const spans = wrapper.find("span");

  expect(spans.length).toBe(2);

  expect(wrapper).toMatchSnapshot();
});
