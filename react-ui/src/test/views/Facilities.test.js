// react imports
import React from "react";
import { shallow } from "enzyme";

// test imports
import { Table } from "reactstrap";
import Facilities from "../../views/Facilities";
import FacilityModal from "../../components/modals/FacilityModal";
import FacilityRow from "../../components/rows/FacilityRow";
import Util from "../../util/Util";

// test mocks
jest.mock("../../util/Auth");
jest.mock("../../util/Util");

afterAll(() => {
  jest.resetAllMocks();
});

test("renders content correctly", () => {
  const testFacilities = [{ id: 1, name: "test" }];
  const wrapper = shallow(<Facilities />);
  wrapper.instance().setState({ facilities: testFacilities });
  const table = wrapper.find(Table);

  expect(table.length).toBe(1);
  expect(wrapper).toMatchSnapshot();
});

test("properly changes state variables", () => {
  Util.delete = jest.fn((url, update) => {
    update();
  });
  const testFacilities = [{ id: 1, name: "test" }];
  const wrapper = shallow(<Facilities />);
  const modal = wrapper.find(FacilityModal);
  let rows = wrapper.find(FacilityRow);

  expect(rows.length).toBe(0);
  wrapper.instance().setState({ loading: true, facilities: testFacilities });
  wrapper.instance().getFacilities();
  expect(wrapper.instance().state.facilities).toEqual([]);
  expect(wrapper.instance().state.loading).toBe(false);

  wrapper.instance().setState({ facilities: testFacilities });
  rows = wrapper.find(FacilityRow);
  expect(rows.length).toBe(1);

  expect(modal.props().getCallback).toBe(wrapper.instance().getFacilities);
  expect(modal.props().active).toBe(false);
  expect(modal.props().facility).toBe(null);
  rows.get(0).props.onEdit();
  expect(wrapper.instance().state.modalActive).toBe(true);
  expect(wrapper.instance().state.editId).toBe(0);
  modal.props().onToggle();
  expect(wrapper.instance().state.modalActive).toBe(false);
  expect(wrapper.instance().state.editId).toBe(-1);

  rows.get(0).props.onDelete();
  expect(Util.delete).toHaveBeenCalledTimes(1);
  expect(wrapper.instance().state.facilities).toEqual([]);
});
