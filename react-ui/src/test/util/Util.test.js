// test imports
import { NotificationManager } from "react-notifications";
import Util from "../../util/Util";

afterEach(() => {
  jest.resetAllMocks();
});

test("checks empty objects correctly", () => {
  const testObject = { test: "test" };

  expect(Util.isEmpty(null)).toBe(true);
  expect(Util.isEmpty("")).toBe(true);
  expect(Util.isEmpty()).toBe(true);
  expect(Util.isEmpty(testObject)).toBe(false);
});

test("fires correct notification types", () => {
  const notificationDuration = 2000;
  const callback = jest.fn();
  NotificationManager.info = jest.fn();
  NotificationManager.success = jest.fn();
  NotificationManager.warning = jest.fn();
  NotificationManager.error = jest.fn();

  Util.notify("info", "infoMessage", "infoTitle", notificationDuration, callback);
  expect(NotificationManager.info).toHaveBeenLastCalledWith(
    "infoMessage",
    "infoTitle",
    notificationDuration,
    callback,
    true
  );
  Util.notify("success", "successMessage", "successTitle", notificationDuration, callback);
  expect(NotificationManager.success).toHaveBeenLastCalledWith(
    "successMessage",
    "successTitle",
    notificationDuration,
    callback,
    true
  );
  Util.notify("warning", "warningMessage", "warningTitle", notificationDuration, callback);
  expect(NotificationManager.warning).toHaveBeenLastCalledWith(
    "warningMessage",
    "warningTitle",
    notificationDuration,
    callback,
    true
  );
  Util.notify("error", "errorMessage", "errorTitle", notificationDuration, callback);
  expect(NotificationManager.error).toHaveBeenLastCalledWith(
    "errorMessage",
    "errorTitle",
    notificationDuration,
    callback,
    true
  );
});

test("generates correct contact information", () => {
  const client = {
    name: "Name",
    surname: "Surname",
    email: "email@test.com"
  };

  expect(Util.getContactInfo(client)).toEqual("Name Surname (email@test.com)");
});

test("can find the correct array element index based on object id", () => {
  const testObject1 = { id: 1 };
  const testObject2 = { id: 2 };
  const array = [testObject1, testObject2];

  expect(Util.findInArrayById(array, 1)).toBe(0);
  expect(Util.findInArrayById(array, 2)).toBe(1);
});

test("generates correct tooltip targets", () => {
  const testTargets = Util.getTooltipTargets(10);

  expect(testTargets.length).toBe(10);
  expect(testTargets[9]).toEqual("Tooltip10");
  expect(Util.tooltipCount).toBe(11);
});
