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
 * @param timeout         notification timeout in milliseconds
 * @param callback        callback fired on notification click
 * @param priority        whether the notification should be displayed as a priority one on top
 */
Util.notify = (type, message, title, timeout = 2000, callback = () => {}, priority = true) => {
  switch (type) {
    case "info":
      NotificationManager.info(message, title, timeout, callback, priority);
      break;
    case "success":
      NotificationManager.success(message, title, timeout, callback, priority);
      break;
    case "warning":
      NotificationManager.warning(message, title, timeout, callback, priority);
      break;
    case "error":
      NotificationManager.error(message, title, timeout, callback, priority);
      break;
    default:
      NotificationManager.info(message, title, timeout, callback, priority);
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
  `&details=${_t.translate("Masseur/Masseuse")}: ${Util.getContactInfo(massage.masseuse)}`;

/**
 * Creates a new contact info String from a given Client.
 * @param client Client to get contact info for
 */
Util.getContactInfo = client => `${client.name} ${client.surname} (${client.email})`;

/**
 * Searches an array for a given item ID.
 * @param array array to search in
 * @param id ID to search for
 * @param idKey attribute name of the ID
 */
Util.findInArrayById = (array, id, idKey = "id") => {
  for (let i = 0; i < array.length; i++) {
    if (array[i][idKey] === id) {
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

/**
 * Check whether a given massage would be over the month time limit or not.
 * @param  massageMinutes number of currently used Massage times per each month in minutes
 * @param  massage massage to be evaluated
 * @return true if the massage is over the limit, false otherwise
 */
Util.isOverTimeLimit = (massageMinutes, massage) => {
  let minutesTotal = moment(massage.ending).diff(moment(massage.date), "minutes");

  const month = moment(massage.date).format("MM-YYYY");
  if (Object.hasOwnProperty.call(massageMinutes, month)) {
    minutesTotal += massageMinutes[month];
  }

  return minutesTotal > Util.MAX_MASSAGE_MINS;
};

/** url of /facilities endpoint */
Util.FACILITIES_URL = process.env.REACT_APP_FACILITIES_URL || "api/facilities/";
/** url of /massages endpoint */
Util.MASSAGES_URL = process.env.REACT_APP_MASSAGES_URL || "api/massages/";
/** url of /clients endpoint */
Util.CLIENTS_URL = process.env.REACT_APP_CLIENTS_URL || "api/clients/";
/** url of /websockets authentication endpoint */
Util.WEBSOCKETS_URL = process.env.REACT_APP_WEBSOCKETS_URL || "api/websockets";
/** url of /logout endpoint */
Util.LOGOUT_URL = process.env.REACT_APP_LOGOUT_URL || "api/logout/";
/** GitHub project url */
Util.GITHUB_URL = process.env.REACT_APP_GITHUB_URL || "https://github.com/";
/** refresh time for authorization tokens in milliseconds */
Util.REFRESH_MIN_TIME = parseInt(process.env.REACT_APP_MIN_REFRESH_TIME, 10) || 150;
/** cancellation limit before the start of a Massage in minutes */
Util.CANCELLATION_LIMIT = parseInt(process.env.REACT_APP_CANCELLATION_LIMIT, 10) || 30;
/** maximum minute time of Massages per Client */
Util.MAX_MASSAGE_MINS = parseInt(process.env.REACT_APP_MASSAGE_TIME_LIMIT, 10) || 120;
/** url of /websockets subscription endpoint with a possible proxy and Websocket protocol */
Util.WEBSOCKET_PROTOCOL_URL = process.env.REACT_APP_WEBSOCKET_PROTOCOL_URL || "wss://api/websockets";
/** maximum amount of WebSocket handshake request retries; wait time increases exponentionally */
Util.WEBSOCKET_RETRY_COUNT = parseInt(process.env.REACT_APP_WEBSOCKET_RETRY_COUNT, 10) || 3;
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
