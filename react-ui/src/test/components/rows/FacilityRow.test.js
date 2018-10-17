// react imports
import React from "react";
import TestRenderer from "react-test-renderer";

// test imports
import DeleteButton from "../../../components/iconbuttons/DeleteButton";
import EditButton from "../../../components/iconbuttons/EditButton";
import FacilityRow from "../../../components/rows/FacilityRow";

test("renders content with correct props", () => {
  const testEditFunction = jest.fn();
  const testDeleteFunction = jest.fn();
  const testRenderer = TestRenderer.create(
    <FacilityRow facility={{ name: "test" }} onEdit={testEditFunction} onDelete={testDeleteFunction} />
  );
  const testInstance = testRenderer.root;
  const cells = testInstance.findAllByType("td");
  const editButton = testInstance.findByType(EditButton);
  const deleteButton = testInstance.findByType(DeleteButton);
  const treeJSON = testRenderer.toJSON();

  expect(cells[0].props.children).toEqual("test");
  expect(editButton.props.onEdit).toBe(testEditFunction);
  expect(deleteButton.props.onDelete).toBe(testDeleteFunction);
  expect(treeJSON).toMatchSnapshot();
});
