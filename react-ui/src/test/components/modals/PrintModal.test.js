// react imports
import React from "react";
import TestRenderer from "react-test-renderer";

// test imports
import moment from "moment";
import BatchButton from "../../../components/buttons/BatchButton";
import PrintModal from "../../../components/modals/PrintModal";
import ModalActions from "../../../components/buttons/ModalActions";

// test mocks
jest.mock("../../../util/Util");

beforeAll(() => {
  Date.now = jest.fn(() => 0);
});

afterEach(() => {
  jest.resetAllMocks();
});

test("renders inside content with correct props and functionality", () => {
  const testFunction = jest.fn();
  const testMasseuses = ["test"];
  const testRenderer = TestRenderer.create(
    <PrintModal
      masseuses={testMasseuses}
      facilityId={1}
      date={moment(new Date(0))}
      onPrint={testFunction}
      withPortal={false}
    />
  );
  const testInstance = testRenderer.root;
  const button = testInstance.findByType(BatchButton);

  button.props.onClick();
  expect(testInstance.instance.state.active).toBe(true);

  const actions = testInstance.findByType(ModalActions);
  const datalistOption = testInstance.findByType("option");
  const treeJSON = testRenderer.toJSON();

  expect(actions.props.onClose).toBe(button.props.onClick);
  expect(datalistOption.props.value).toBe("test");

  actions.props.onProceed();

  expect(testFunction).not.toHaveBeenCalled();
  expect(testInstance.instance.state.active).toBe(false);
  expect(treeJSON).toMatchSnapshot();
});
