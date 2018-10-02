// test imports
import Auth from '../../util/Auth';
import { NotificationManager } from 'react-notifications';
import Util from '../../util/Util';

afterEach(() => {
  jest.resetAllMocks();
});

test('checks empty objects correctly', () => {
  const testObject = { test: 'test' };

  expect(Util.isEmpty(null)).toBe(true);
  expect(Util.isEmpty('')).toBe(true);
  expect(Util.isEmpty()).toBe(true);
  expect(Util.isEmpty(testObject)).toBe(false);
})

test('fires correct notification types', () => {
  const notificationDuration = 2000;
  NotificationManager.info = jest.fn();
  NotificationManager.success = jest.fn();
  NotificationManager.warning = jest.fn();
  NotificationManager.error = jest.fn();

  Util.notify('info', 'infoMessage', 'infoTitle');
  expect(NotificationManager.info)
    .toHaveBeenLastCalledWith('infoMessage', 'infoTitle', notificationDuration);
  Util.notify('success', 'successMessage', 'successTitle');
  expect(NotificationManager.success)
    .toHaveBeenLastCalledWith('successMessage', 'successTitle', notificationDuration, null, true);
  Util.notify('warning', 'warningMessage', 'warningTitle');
  expect(NotificationManager.warning)
    .toHaveBeenLastCalledWith('warningMessage', 'warningTitle', notificationDuration);
  Util.notify('error', 'errorMessage', 'errorTitle');
  expect(NotificationManager.error)
    .toHaveBeenLastCalledWith('errorMessage', 'errorTitle', notificationDuration, null, true);
})

test('automatic cursor movement does not change event value', () => {
  var event = { target: { value: "test" }};
  Util.moveCursorToEnd(event);

  expect(event.target.value).toEqual("test");
})

test('generates correct contact information', () => {
  var client = {
    name: "Name",
    surname: "Surname",
    email: "email@test.com"
  };

  expect(Util.getContactInfo(client)).toEqual("Name Surname (email@test.com)");
})

test('can find the correct array element index based on object id', () => {
  const testObject1 = { id: 1 };
  const testObject2 = { id: 2 };
  const array = [testObject1, testObject2];

  expect(Util.findInArrayById(array, 1)).toBe(0);
  expect(Util.findInArrayById(array, 2)).toBe(1);
})
