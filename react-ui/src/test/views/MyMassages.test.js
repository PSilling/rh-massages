// react imports
import React from "react";
import { Link } from "react-router-dom";
import { shallow } from "enzyme";

// test imports
import MyMassages from "../../views/MyMassages";
import MyMassagePanel from "../../components/panels/MyMassagePanel";
import _t from "../../util/Translations";

// test mocks
jest.mock("../../util/Fetch");
jest.mock("../../util/Util");

afterAll(() => {
  jest.resetAllMocks();
});

test("renders content correctly", () => {
  const wrapper = shallow(<MyMassages />);
  const link = wrapper.find(Link);

  expect(link.length).toBe(1);
  expect(wrapper).toMatchSnapshot();
});

test("properly changes state variables", () => {
  const testMassages = [
    {
      id: 1,
      date: new Date(),
      ending: new Date(),
      client: null,
      facility: { id: 1, name: "test" }
    }
  ];
  const wrapper = shallow(<MyMassages />);

  testMassages[0].ending.setHours(testMassages[0].ending.getHours() + 1);
  let panels = wrapper.find(MyMassagePanel);

  expect(panels.length).toBe(0);
  wrapper.instance().setState({ loading: true, massages: testMassages });
  wrapper.instance().getMassages();
  expect(wrapper.instance().state.massages).toEqual([]);
  expect(wrapper.instance().state.loading).toBe(false);

  wrapper.instance().setState({ massages: testMassages });
  const header = wrapper.find("h2");
  panels = wrapper.find(MyMassagePanel);
  expect(header.props().children).toEqual(_t.translate("Today"));
  expect(panels.length).toBe(1);
  expect(panels.get(0).props.type).toBe("info");
  expect(panels.get(0).props.massage).toBe(testMassages[0]);
  expect(panels.get(0).props.disabled).toBe(false);

  panels.get(0).props.getCallback();
  expect(wrapper.instance().state.massages).toEqual([]);
});
