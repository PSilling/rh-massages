// react imports
import React from "react";

// module imports
import moment from "moment";
import { NotificationManager } from "react-notifications";

// util imports
import _t from "./Translations";
import Auth from "./Auth";

const Util = function Util() {};

/**
 * Checks whether an Object is null, undefined or an empty string.
 *
 * @param  object Object to check
 * @return true if empty, false otherwise
 */
Util.isEmpty = function isEmpty(object) {
  return object === null || typeof object === "undefined" || object === "";
};

/**
 * Creates a new notification message. Supports types info, success, warning and error.
 *
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
 * Fetches data from a given endpoint.
 *
 * @param url             defined endpoint
 * @param update          callback function to update the resources
 */
Util.get = (url, update) => {
  Auth.keycloak
    .updateToken(Util.REFRESH_MIN_TIME)
    .success(() => {
      fetch(url, {
        method: "get",
        headers: {
          Authorization: `Bearer ${Auth.getToken()}`
        }
      })
        .then(response => {
          if (response.ok) {
            return response.json();
          }
          Util.notify(
            "error",
            _t.translate("Your request has ended unsuccessfully."),
            _t.translate("An error occurred!")
          );
          return null;
        })
        .catch(error => {
          Util.notify("error", error.toString(), _t.translate("An error occurred!"));
        })
        .then(json => {
          update(json);
        });
    })
    .error(() => {
      /* eslint-disable-next-line no-console */
      console.log("Failed to refresh the token!");
      Auth.keycloak.login();
    });
};

/**
 * Creates a new element at a given endpoint.
 *
 * @param url             defined endpoint
 * @param data            data to send
 * @param update          callback function to update the resources
 * @param notify          false if success notifications should be suppressed
 */
Util.post = (url, data, update, notify = true) => {
  Auth.keycloak
    .updateToken(Util.REFRESH_MIN_TIME)
    .success(() => {
      fetch(url, {
        method: "post",
        credentials: "same-origin",
        headers: {
          Authorization: `bearer ${Auth.getToken()}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
      }).then(response => {
        if (response.ok) {
          if (notify) {
            Util.notify("success", "", _t.translate("Your request has been successful."));
          }
          update();
        } else {
          Util.notify(
            "error",
            _t.translate("Your request has ended unsuccessfully."),
            _t.translate("An error occured!")
          );
        }
      });
    })
    .error(() => {
      /* eslint-disable-next-line no-console */
      console.log("Failed to refresh the token!");
      Auth.keycloak.login();
    });
};

/**
 * Edits an element at a given endpoint.
 *
 * @param url             defined endpoint
 * @param data            data to send
 * @param update          callback function to update the resources
 * @param notify          false if success notifications should be suppressed
 */
Util.put = (url, data, update, notify = true) => {
  Auth.keycloak
    .updateToken(Util.REFRESH_MIN_TIME)
    .success(() => {
      fetch(url, {
        method: "put",
        credentials: "same-origin",
        headers: {
          Authorization: `bearer ${Auth.getToken()}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
      }).then(response => {
        if (response.ok) {
          if (notify) {
            Util.notify("success", "", _t.translate("Your request has been successful."));
          }
          update();
        } else {
          Util.notify(
            "error",
            _t.translate("Your request has ended unsuccessfully."),
            _t.translate("An error occured!")
          );
        }
      });
    })
    .error(() => {
      /* eslint-disable-next-line no-console */
      console.log("Failed to refresh the token!");
      Auth.keycloak.login();
    });
};

/**
 * Deletes an element at a given endpoint.
 *
 * @param url             defined endpoint
 * @param update          callback function to update the resources
 * @param notify          false if success notifications should be suppressed
 */
Util.delete = (url, update, notify = true) => {
  Auth.keycloak
    .updateToken(Util.REFRESH_MIN_TIME)
    .success(() => {
      fetch(url, {
        method: "delete",
        credentials: "same-origin",
        headers: {
          Authorization: `bearer ${Auth.getToken()}`
        }
      }).then(response => {
        if (response.ok) {
          if (notify) {
            Util.notify("success", "", _t.translate("Your request has been successful."));
          }
          update();
        } else {
          Util.notify(
            "error",
            _t.translate("Your request has ended unsuccessfully."),
            _t.translate("An error occured!")
          );
        }
      });
    })
    .error(() => {
      /* eslint-disable-next-line no-console */
      console.log("Failed to refresh the token!");
      Auth.keycloak.login();
    });
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
 *
 * @param massage the Massage to be added to the calendar
 */
Util.addToCalendar = massage => {
  let url = "https://www.google.com/calendar/render?action=TEMPLATE";
  url += `&text=${_t.translate("Massage")}`;
  url += `&dates=${moment
    .utc(massage.date)
    .format("YYYYMMDDTHHmmssZ")
    .replace("+00:00", "Z")}`;
  url += `/${moment
    .utc(massage.ending)
    .format("YYYYMMDDTHHmmssZ")
    .replace("+00:00", "Z")}`;
  url += `&location=Red%20Hat%20Czech%20${massage.facility.name}`;
  url += `&details=${_t.translate("Masseur/Masseuse")}: ${massage.masseuse}`;
  return url;
};

/**
 * Moves cursor in an input field to the end of event value.
 */
Util.moveCursorToEnd = event => {
  const { value } = event.target;
  event.target.value = "";
  event.target.value = value;
};

/**
 * Returns a highlighted text based on an search query (highlights the first occurrence only).
 *
 * @param text      text to be highlighted
 * @param query     search query String
 */
Util.highlightInText = (text, query) => {
  const searchIndex = text
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .indexOf(
      query
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .toLowerCase()
    );
  if (searchIndex === -1) {
    return text;
  }
  const textStart = text.substring(0, searchIndex);

  const firstOccurrence = text.substring(searchIndex, searchIndex + query.length);

  const textRest = text.substring(searchIndex + query.length);
  return (
    <span>
      {textStart}
      <strong>{firstOccurrence}</strong>
      {textRest}
    </span>
  );
};

/**
 * Creates a new contact info String from a given Client.
 *
 * @param client Client to get contact info for
 */
Util.getContactInfo = client => `${client.name} ${client.surname} (${client.email})`;

/**
 * Searches an array for a given item ID.
 *
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

Util.FACILITIES_URL = "api/facilities/"; // url of /facilities endpoint
Util.MASSAGES_URL = "api/massages/"; // url of /massages endpoint
Util.CLIENTS_URL = "api/clients/"; // url of /clients endpoint
Util.LOGOUT_URL = "api/logout/"; // url of /logout endpoint
Util.GITHUB_URL = "https://github.com/PSilling/rh-massages/"; // GitHub project url
Util.REFRESH_MIN_TIME = 150; // refresh time for authorization tokens in milliseconds
Util.AUTO_REFRESH_TIME = 1000; // automatic update interval for Massages view in milliseconds
Util.CANCELLATION_LIMIT = 30; // cancellation limit before the start of a Massage in minutes
Util.MAX_MASSAGE_MINS = 120; // maximal minute time of Massages per Client

export default Util;
