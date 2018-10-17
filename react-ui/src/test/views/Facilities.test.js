// react imports
import React from "react";
import TestRenderer from "react-test-renderer";

// test imports
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
  const testRenderer = TestRenderer.create(<Facilities />);
  const testInstance = testRenderer.root;
  testInstance.instance.setState({ facilities: testFacilities });
  const treeJSON = testRenderer.toJSON();

  testInstance.findByType("table");

  expect(treeJSON).toMatchSnapshot();
});

test("properly changes state variables", () => {
  Util.delete = jest.fn((url, update) => {
    update();
  });
  const testFacilities = [{ id: 1, name: "test" }];
  const testRenderer = TestRenderer.create(<Facilities />);
  const testInstance = testRenderer.root;
  const modal = testInstance.findByType(FacilityModal);

  let rows = testInstance.findAllByType(FacilityRow);

  expect(rows.length).toBe(0);
  testInstance.instance.setState({ loading: true, facilities: testFacilities });
  testInstance.instance.getFacilities();
  expect(testInstance.instance.state.facilities).toEqual([]);
  expect(testInstance.instance.state.loading).toBe(false);

  testInstance.instance.setState({ facilities: testFacilities });
  rows = testInstance.findAllByType(FacilityRow);
  expect(rows.length).toBe(1);

  expect(modal.props.getCallback).toBe(testInstance.instance.getFacilities);
  expect(modal.props.active).toBe(false);
  expect(modal.props.facility).toBe(null);
  rows[0].props.onEdit();
  expect(modal.props.active).toBe(true);
  expect(modal.props.facility).toBe(testFacilities[0]);
  modal.props.onToggle();
  expect(modal.props.active).toBe(false);
  expect(modal.props.facility).toBe(null);

  rows[0].props.onDelete();
  expect(Util.delete).toHaveBeenCalledTimes(1);
  expect(testInstance.instance.state.facilities).toEqual([]);
});
