// react imports
import React from 'react';
import { MemoryRouter } from 'react-router';
import { Link } from 'react-router-dom';
import TestRenderer from 'react-test-renderer';

// test imports
import MyMassages from '../../views/MyMassages';
import MyMassagePanel from '../../components/panels/MyMassagePanel';
import _t from '../../util/Translations';

// test mocks
jest.mock('../../util/Util');

afterAll(() => {
  jest.resetAllMocks();
});

test('renders content correctly', () => {
  const testRenderer = TestRenderer.create(
          <MemoryRouter>
            <MyMassages />
          </MemoryRouter>
        ),
        testInstance = testRenderer.root;

  let link = testInstance.findByType(Link),
      treeJSON = testRenderer.toJSON();

  expect(treeJSON).toMatchSnapshot();
});

test('properly changes state variables', () => {
  const testMassages = [{
          id: 1,
          date: new Date(),
          ending: new Date(),
          client: null,
          facility: { id: 1, name: "test" }
        }],
        testRenderer = TestRenderer.create(
          <MemoryRouter>
            <MyMassages />
          </MemoryRouter>
        ),
        testInstance = testRenderer.root;

  testMassages[0].ending.setHours(testMassages[0].ending.getHours() + 1);
  let view = testInstance.findByType(MyMassages),
      panels = testInstance.findAllByType(MyMassagePanel);

  expect(panels.length).toBe(0);
  view.instance.setState({ loading: true, massages: testMassages });
  view.instance.getMassages();
  expect(view.instance.state.massages).toEqual([]);
  expect(view.instance.state.loading).toBe(false);

  view.instance.setState({ massages: testMassages });
  let headers = testInstance.findAllByType('h1');
  panels = testInstance.findAllByType(MyMassagePanel);
  expect(headers.length).toBe(2);
  expect(headers[1].props.children).toEqual(_t.translate('Today'));
  expect(panels.length).toBe(1);
  expect(panels[0].props.type).toBe("info");
  expect(panels[0].props.massage).toBe(testMassages[0]);
  expect(panels[0].props.disabled).toBe(false);

  panels[0].props.getCallback();
  expect(view.instance.state.massages).toEqual([]);
});
