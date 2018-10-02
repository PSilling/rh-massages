// react imports
import React from 'react';
import { Router, Link } from 'react-router-dom';
import TestRenderer from 'react-test-renderer';

// test imports
import App, { NavWithLinks } from '../App';
import Auth from '../util/Auth';
import UnauthorizedMessage from '../components/util/UnauthorizedMessage';
import _t from '../util/Translations';

// test mocks
jest.mock('../util/Auth');
jest.mock('../util/Util');

afterEach(() => {
  jest.resetAllMocks();
});

test('renders admin content correctly', () => {
  const testRenderer = TestRenderer.create(<App />),
        testInstance = testRenderer.root;

  let router = testInstance.findByType(Router),
      links = testInstance.findAllByType(Link),
      rightBar = testInstance.findByProps({ className: "nav navbar-nav navbar-right" }),
      massagesLinks = testInstance.findAllByProps({ to: "/" }),
      myMassageLink = testInstance.findByProps({ to: "/my-massages" }),
      facilitiesLink = testInstance.findByProps({ to: "/facilities" }),
      massagesArchiveLink = testInstance.findByProps({ to: "/massages-archive" }),
      settingsLink = testInstance.findByProps({ to: "/settings" }),
      treeJSON = testRenderer.toJSON();

  expect(Auth.isAdmin).toHaveBeenCalledTimes(2);
  expect(Auth.isAuthenticated).toHaveBeenCalledTimes(3);
  expect(links).toHaveLength(6);
  expect(massagesLinks).toHaveLength(2);
  expect(massagesLinks[0].props.children).toBe(_t.translate("Massages"));
  expect(massagesLinks[1].props.children).toBe(_t.translate("Massages"));
  expect(myMassageLink.props.children).toBe(_t.translate("My Massages"));
  expect(facilitiesLink.props.children).toBe(_t.translate("Facilities"));
  expect(massagesArchiveLink.props.children).toBe(_t.translate("Massages Archive"));
  expect(settingsLink.props.children).toBe(_t.translate("Settings"));
  expect(rightBar.props.children).toHaveLength(3);
  expect(treeJSON).toMatchSnapshot();
});

test('renders unauthorized content correctly', () => {
  Auth.isAuthenticated = jest.fn().mockImplementation(() => false);

  const testRenderer = TestRenderer.create(<App />),
        testInstance = testRenderer.root;

  let message = testInstance.findByType(UnauthorizedMessage),
      treeJSON = testRenderer.toJSON();

  expect(Auth.isAdmin).not.toHaveBeenCalled();
  expect(Auth.isAuthenticated).toHaveBeenCalledTimes(1);
  expect(message.props.title).toBe(_t.translate('Massages'));
  expect(treeJSON).toMatchSnapshot();
});

test('hides non-admin Links correctly', () => {
  Auth.isAuthenticated = jest.fn().mockImplementation(() => true);
  Auth.isAdmin = jest.fn().mockImplementation(() => false);

  const testRenderer = TestRenderer.create(<App />),
        testInstance = testRenderer.root;

  let links = testInstance.findAllByType(Link);

  expect(Auth.isAdmin).toHaveBeenCalledTimes(2);
  expect(Auth.isAuthenticated).toHaveBeenCalledTimes(2);
  expect(links).toHaveLength(4);
});
