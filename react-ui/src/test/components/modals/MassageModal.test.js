// react imports
import React from "react";
import TestRenderer from "react-test-renderer";

// test imports
import Datetime from "react-datetime";
import moment from "moment";
import AddButton from "../../../components/iconbuttons/AddButton";
import MassageModal from "../../../components/modals/MassageModal";
import ModalActions from "../../../components/buttons/ModalActions";
import _t from "../../../util/Translations";

// test mocks
jest.mock("../../../util/Util");

beforeAll(() => {
  Date.now = jest.fn(() => 0);
});

test("renders inside content with correct props", () => {
  const testGetFunction = jest.fn();
  const testToggleFunction = jest.fn();
  const testMasseuses = ["test"];
  const testRenderer = TestRenderer.create(
    <MassageModal
      active
      massage={null}
      facilityId={1}
      masseuses={testMasseuses}
      getCallback={testGetFunction}
      onToggle={testToggleFunction}
      withPortal={false}
    />
  );
  const testInstance = testRenderer.root;
  const button = testInstance.findByType(AddButton);
  const actions = testInstance.findByType(ModalActions);
  const heading = testInstance.findByType("h2");
  const inputs = testInstance.findAllByType("input");
  const datetimes = testInstance.findAllByType(Datetime);
  const datalistOption = testInstance.findByType("option");
  const treeJSON = testRenderer.toJSON();

  actions.props.onProceed();

  expect(testToggleFunction).not.toHaveBeenCalled();
  expect(testGetFunction).not.toHaveBeenCalled();
  expect(button.props.onAdd).toBe(testToggleFunction);
  expect(actions.props.onClose).toBe(testToggleFunction);
  expect(heading.props.children).toEqual(_t.translate("New Massage"));
  expect(inputs[0].props.value).toBe("");
  expect(datetimes[0].props.value).toBe(null);
  expect(datetimes[1].props.value).toBe(null);
  expect(datalistOption.props.value).toBe("test");
  expect(treeJSON).toMatchSnapshot();
});

test("switches to edit mode when a Massage is given", () => {
  const testGetFunction = jest.fn();
  const testToggleFunction = jest.fn();
  const testMassage = {
    id: 1,
    date: new Date(0),
    ending: new Date(1000),
    masseuse: "test",
    client: null,
    facility: { id: 1, name: "test" }
  };
  const testRenderer = TestRenderer.create(
    <MassageModal
      active
      massage={testMassage}
      facilityId={1}
      masseuses={[]}
      getCallback={testGetFunction}
      onToggle={testToggleFunction}
      withPortal={false}
    />
  );
  const testInstance = testRenderer.root;

  testRenderer.update(
    <MassageModal
      active
      massage={testMassage}
      facilityId={1}
      masseuses={[]}
      getCallback={testGetFunction}
      onToggle={testToggleFunction}
      withPortal={false}
    />
  );

  const actions = testInstance.findByType(ModalActions);
  const heading = testInstance.findByType("h2");
  const inputs = testInstance.findAllByType("input");
  const datetimes = testInstance.findAllByType(Datetime);

  expect(testToggleFunction).not.toHaveBeenCalled();
  expect(testGetFunction).not.toHaveBeenCalled();

  actions.props.onProceed();

  expect(testToggleFunction).toHaveBeenCalledTimes(1);
  expect(testGetFunction).toHaveBeenCalledTimes(1);
  expect(heading.props.children).toEqual(_t.translate("Edit Massage"));
  expect(actions.props.primaryLabel).toBe(_t.translate("Edit"));
  expect(inputs[0].props.value).toBe("test");
  expect(datetimes[0].props.value).toEqual(moment.utc(moment(testMassage.ending).diff(moment(testMassage.date))));
  expect(datetimes[1].props.value).not.toBe(null);
  jest.resetAllMocks();
});
