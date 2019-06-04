// react imports
import React from "react";
import { Link } from "react-router-dom";
import { shallow } from "enzyme";

// test imports
import MyMassages from "../../views/MyMassages";
import Fetch from "../../util/Fetch";

// test mocks
jest.mock("../../util/Fetch");
jest.mock("../../util/Util");

afterAll(() => {
  jest.resetAllMocks();
});

test("renders content correctly", () => {
  const wrapper = shallow(<MyMassages />);

  expect(Fetch.tryWebSocketSend).toHaveBeenCalledTimes(2);
  expect(Fetch.send).toHaveBeenCalledTimes(2);

  const link = wrapper.find(Link);

  expect(link.length).toBe(1);
  expect(wrapper).toMatchSnapshot();
});

test("properly changes state variables", () => {
  const testEvents = [
    {
      massage: {
        id: 1,
        date: new Date(0),
        ending: new Date(1000),
        client: null,
        facility: { id: 1, name: "test" }
      }
    }
  ];
  const wrapper = shallow(<MyMassages />);

  wrapper.instance().setState({ loading: true, events: testEvents, filteredEvents: testEvents });
  wrapper.instance().getMassages();
  expect(wrapper.instance().state.events).toEqual([]);
  expect(wrapper.instance().state.loading).toBe(false);
  wrapper.instance().setState({ events: testEvents, filteredEvents: testEvents });

  expect(wrapper).toMatchSnapshot();
});
