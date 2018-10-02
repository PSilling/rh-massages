// react imports
import React from 'react';
import TestRenderer from 'react-test-renderer';

// test imports
import ConfirmationModal from '../../../components/modals/ConfirmationModal';
import moment from 'moment';
import MyMassagePanel from '../../../components/panels/MyMassagePanel';
import _t from '../../../util/Translations';

// test mocks
jest.mock('../../../util/Util');

afterEach(() => {
  jest.resetAllMocks();
});

test('renders content with correct props', () => {
  const testFunction = jest.fn(),
        testMassage = {
          id: 1,
          date: new Date(0),
          ending: new Date(1000),
          client: null,
          facility: { id: 1, name: "test" }
        },
        testRenderer = TestRenderer.create(
          <MyMassagePanel massage={testMassage} getCallback={testFunction} />
        ),
        testInstance = testRenderer.root;

  let paragraphs = testInstance.findAllByType('p'),
      header = testInstance.findByProps({ className: "panel-heading" }),
      buttons = testInstance.findAllByType('button'),
      panel = testInstance.findByProps({ className: "panel panel-default" }),
      treeJSON = testRenderer.toJSON();

  expect(header.props.children[0]).toEqual(moment(testMassage.date).format("ddd L"));
  expect(paragraphs[0].props.children).toEqual(
    _t.translate('Facility') + ": " + testMassage.facility.name
  );
  expect(paragraphs[1].props.children).toEqual(
    _t.translate('Masseur/Masseuse') + ": " + testMassage.masseuse
  );
  expect(paragraphs[2].props.children).toEqual(
    _t.translate('Time') + ": " + moment(testMassage.date).format("HH:mm")
      + "–" + moment(testMassage.ending).format("HH:mm")
  );
  expect(testFunction).not.toHaveBeenCalled();

  buttons[0].props.onClick();
  let modal = testInstance.findByType(ConfirmationModal);
  modal.props.onConfirm();

  expect(testFunction).toHaveBeenCalledTimes(1);
  expect(treeJSON).toMatchSnapshot();
});
