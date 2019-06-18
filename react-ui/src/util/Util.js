/**
 * Utility class containing project-wide utility functions.
 */

// module imports
import moment from "moment";
import { NotificationManager } from "react-notifications";

// util imports
import _t from "./Translations";

const Util = function Util() {};

/**
 * Creates a new notification message. Supports types info, success, warning and error.
 * @param type            notification type
 * @param message         notification message
 * @param title           notification title
 */
Util.notify = (type, message, title) => {
  switch (type) {
    case "info":
      NotificationManager.info(message, title, 2000);
      break;
    case "success":
      NotificationManager.success(message, title, 2000, null, true);
      break;
    case "warning":
      NotificationManager.warning(message, title, 2000);
      break;
    case "error":
      NotificationManager.error(message, title, 2000, null, true);
      break;
    default:
      NotificationManager.info(message, title, 2000);
      break;
  }
};

/**
 * Checks whether an Object is null, undefined or an empty string.
 * @param  object Object to check
 * @return true if empty, false otherwise
 */
Util.isEmpty = function isEmpty(object) {
  return object === null || typeof object === "undefined" || object === "";
};

/**
 * Clears all active intervals in the client.
 */
Util.clearAllIntervals = () => {
  const maxIntervalId = setTimeout(() => {
    for (let i = 0; i < maxIntervalId; i++) {
      clearInterval(i);
    }
  }, 0);
};

/**
 * Generates a Google Calendar link for a given massage event.
 * @param massage the Massage to be added to the calendar
 */
Util.getEventLink = massage =>
  "https://www.google.com/calendar/render?action=TEMPLATE" +
  `&text=${_t.translate("Massage")}` +
  `&dates=${moment
    .utc(massage.date)
    .format("YYYYMMDDTHHmmssZ")
    .replace("+00:00", "Z")}` +
  `/${moment
    .utc(massage.ending)
    .format("YYYYMMDDTHHmmssZ")
    .replace("+00:00", "Z")}` +
  `&location=Red%20Hat%20Czech%20${massage.facility.name}` +
  `&details=${_t.translate("Masseur/Masseuse")}: ${massage.masseuse.name} ${massage.masseuse.surname} (${
    massage.masseuse.email
  })`;

/**
 * Creates a new contact info String from a given Client.
 * @param client Client to get contact info for
 */
Util.getContactInfo = client => `${client.name} ${client.surname} (${client.email})`;

/**
 * Searches an array for a given item ID.
 * @param array array to search in
 * @param id id to search for
 */
Util.findInArrayById = (array, id) => {
  for (let i = 0; i < array.length; i++) {
    if (array[i].id === id) {
      return i;
    }
  }
  return -1;
};

/**
 * Searches a massage event array for a given massage ID.
 * @param array array to search in
 * @param id id to search for
 */
Util.findInArrayByMassageId = (array, id) => {
  for (let i = 0; i < array.length; i++) {
    if (array[i].massage.id === id) {
      return i;
    }
  }
  return -1;
};

/**
 * Returns an array of tooltip targets for unique tooltip ID use.
 * @param  count number of tooltip targets to generate
 * @return       array of generated tooltip targets
 */
Util.getTooltipTargets = count => {
  const targets = [];
  for (let i = 0; i < count; i++) {
    targets.push(`Tooltip${Util.tooltipCount++}`);
  }
  return targets;
};

/** url of /facilities endpoint */
Util.FACILITIES_URL = process.env.REACT_APP_FACILITIES_URL || "api/facilities/";
/** url of /massages endpoint */
Util.MASSAGES_URL = process.env.REACT_APP_MASSAGES_URL || "api/massages/";
/** url of /clients endpoint */
Util.CLIENTS_URL = process.env.REACT_APP_CLIENTS_URL || "api/clients/";
/** url of /logout endpoint */
Util.LOGOUT_URL = process.env.REACT_APP_LOGOUT_URL || "api/logout/";
/** url of /logout endpoint */
Util.SUBSCRIPTIONS_URL = process.env.REACT_APP_SUBSCRIPTIONS_URL || "api/websockets";
/** GitHub project url */
Util.GITHUB_URL = process.env.REACT_APP_GITHUB_URL || "https://github.com/";
/** refresh time for authorization tokens in milliseconds */
Util.REFRESH_MIN_TIME = parseInt(process.env.REACT_APP_MIN_REFRESH_TIME, 10) || 150;
/** automatic update interval for Massages view in milliseconds */
Util.AUTO_REFRESH_TIME = parseInt(process.env.REACT_APP_AUTO_REFRESH_TIME, 10) || 5000;
/** cancellation limit before the start of a Massage in minutes */
Util.CANCELLATION_LIMIT = parseInt(process.env.REACT_APP_CANCELLATION_LIMIT, 10) || 30;
/** maximum minute time of Massages per Client */
Util.MAX_MASSAGE_MINS = parseInt(process.env.REACT_APP_MASSAGE_TIME_LIMIT, 10) || 120;
/** protocol to use for WebSocket communication */
Util.WEBSOCKET_PROTOCOL = process.env.WEBSOCKET_PROTOCOL || "ws";
/** maximum amount of WebSocket handshake request retries; wait time increases exponentionally */
Util.WEBSOCKET_RETRY_COUNT = process.env.WEBSOCKET_RETRY_COUNT || 3;
/** maximum wait time for WebSocket actions */
Util.WEBSOCKET_TIMEOUT_LIMIT = process.env.REACT_APP_WEBSOCKET_TIMEOUT_LIMIT || 250;
/** display color of success events */
Util.SUCCESS_COLOR = process.env.REACT_APP_SUCCESS_COLOR || "#2fad2f";
/** display color of warning events */
Util.WARNING_COLOR = process.env.REACT_APP_WARNING_COLOR || "#ee9d2a";
/** display color of error events */
Util.ERROR_COLOR = process.env.REACT_APP_ERROR_COLOR || "#d10a14";

/** current number of tooltips (needed for correct ID placement) */
Util.tooltipCount = 1;

export default Util;
