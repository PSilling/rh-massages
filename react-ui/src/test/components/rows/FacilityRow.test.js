// react imports
import React from 'react';
import TestRenderer from 'react-test-renderer';

// test imports
import DeleteButton from '../../../components/iconbuttons/DeleteButton';
import EditButton from '../../../components/iconbuttons/EditButton';
import FacilityRow from '../../../components/rows/FacilityRow';

test('renders content with correct props', () => {
  const testEditFunction = jest.fn(),
        testDeleteFunction = jest.fn(),
        testRenderer = TestRenderer.create(
          <FacilityRow facility={{ name: "test" }} onEdit={testEditFunction}
            onDelete={testDeleteFunction} />
        ),
        testInstance = testRenderer.root;

  let cells = testInstance.findAllByType('td'),
      editButton = testInstance.findByType(EditButton),
      deleteButton = testInstance.findByType(DeleteButton),
      treeJSON = testRenderer.toJSON();

  expect(cells[0].props.children).toEqual("test");
  expect(editButton.props.onEdit).toBe(testEditFunction);
  expect(deleteButton.props.onDelete).toBe(testDeleteFunction);
  expect(treeJSON).toMatchSnapshot();
});
