// react imports
import React from 'react';

// module imports
import moment from 'moment';
import { NotificationManager } from 'react-notifications';

// util imports
import _t from './Translations';
import Auth from './Auth';

var Util = function() { };

/**
 * Checks whether an object is null, undefined or an empty string
 *
 * @param  object to check
 * @return boolean
 */
Util.isEmpty = function(object) {
  return (object === null) || (typeof object === 'undefined') || (object === '');
}

/**
 * Creates a new notification.
 *
 * @param type            notification type
 * @param message         notification message
 * @param title           notification title
 */
Util.notify = (type, message, title) => {
  switch (type) {
    case 'info':
      NotificationManager.info(message, title, 2000);
      break;
    case 'success':
      NotificationManager.success(message, title, 2000, null, true);
      break;
    case 'warning':
      NotificationManager.warning(message, title, 2000);
      break;
    case 'error':
      NotificationManager.error(message, title, 2000, null, true);
      break;
    default:
      NotificationManager.info(message, title, 2000);
      break;
  };
}

/**
 * Fetches data from a given endpoint.
 *
 * @param url             defined endpoint
 * @param update          callback function to update the resources
 */
Util.get = (url, update) => {
  Auth.keycloak.updateToken(Util.REFRESH_MIN_TIME).success(function() {
    fetch(url, {
      method: 'get',
      headers: {
        'Authorization': 'Bearer ' + Auth.getToken()
      }
    }).then(function(response) {
      if (response.ok) {
        return response.json();
      } else {
        Util.notify("error", _t.translate('Your request has ended unsuccessfully.'),
          _t.translate('An error occured!'));
      }
    }).then(function(json) {
      update(json);
    });
  }).error(function() {
    console.log('Failed to refresh the token!');
    Auth.keycloak.login();
  });
}

/**
 * Creates a new element at a given endpoint.
 *
 * @param url             defined endpoint
 * @param data            data to send
 * @param update          callback function to update the resources
 * @param notify          false if success notifications should be suppressed
 */
Util.post = (url, data, update, notify = true) => {
  Auth.keycloak.updateToken(Util.REFRESH_MIN_TIME).success(function() {
    fetch(url, {
      method: 'post',
      credentials: 'same-origin',
      headers: {
        "Authorization" : "bearer " + Auth.getToken(),
        "Content-Type" : "application/json"
      },
      body: JSON.stringify(data)
    }).then(function(response) {
      if (response.ok) {
        if (notify) {
          Util.notify("success", "", _t.translate('Your request has been successful.'));
          update();
        }
      } else {
        Util.notify("error", _t.translate('Your request has ended unsuccessfully.'),
          _t.translate('An error occured!'));
      }
    });
  }).error(function() {
    console.log('Failed to refresh the token!');
    Auth.keycloak.login();
  });
}

/**
 * Edits an element at a given endpoint.
 * @param url             defined endpoint
 * @param data            data to send
 * @param update          callback function to update the resources
 * @param notify          false if success notifications should be suppressed
 */
Util.put = (url, data, update, notify = true) => {
  Auth.keycloak.updateToken(Util.REFRESH_MIN_TIME).success(function() {
    fetch(url, {
      method: 'put',
      credentials: 'same-origin',
      headers: {
        "Authorization" : "bearer " + Auth.getToken(),
        "Content-Type" : "application/json"
      },
      body: JSON.stringify(data)
    }).then(function(response) {
      if (response.ok) {
        if (notify) {
          Util.notify("success", "", _t.translate('Your request has been successful.'));
          update();
        }
      } else {
        Util.notify("error", _t.translate('Your request has ended unsuccessfully.'),
          _t.translate('An error occured!'));
      }
    });
  }).error(function() {
    console.log('Failed to refresh the token!');
    Auth.keycloak.login();
  });
}

/**
 * Deletes an element at a given endpoint.
 * @param url             defined endpoint
 * @param update          callback function to update the resources
 * @param notify          false if success notifications should be suppressed
 */
Util.delete = (url, update, notify = true) => {
  Auth.keycloak.updateToken(Util.REFRESH_MIN_TIME).success(function() {
    fetch(url, {
      method: 'delete',
      credentials: 'same-origin',
      headers: {
        "Authorization" : "bearer " + Auth.getToken()
      }
    }).then(function(response) {
      if (response.ok) {
        if (notify) {
          Util.notify("success", "", _t.translate('Your request has been successful.'));
          update();
        }
      } else {
        Util.notify("error", _t.translate('Your request has ended unsuccessfully.'),
          _t.translate('An error occured!'));
      }
    });
  }).error(function() {
    console.log('Failed to refresh the token!');
    Auth.keycloak.login();
  });
}

/**
 * Stops all active intervals.
 */
Util.clearAllIntervals = () => {
  var maxIntervalId = setTimeout(function() {
    for (var i = 0; i < maxIntervalId; i++) {
        clearInterval(i);
    }
  }, 0);
}

/**
 * Adds a massage event to Google Calendar (opens a new tab).
 *
 * @param massage the massage to be added to the calendar
 */
Util.addToCalendar = (massage) => {
  var url = "https://www.google.com/calendar/render?action=TEMPLATE";
  url += "&text=" + _t.translate('Massage in facility') + ' ' + massage.facility.name;
  url += "&dates=" + moment.utc(massage.date).format("YYYYMMDDTHHmmssZ").replace("+00:00", "Z");
  url += "/" + moment.utc(massage.ending).format("YYYYMMDDTHHmmssZ").replace("+00:00", "Z");
  url += "&details=" + _t.translate('Masseur/Masseuse') + ' ' + massage.masseuse;

  window.open(url,"_blank");
}

/**
 * Moves cursor in an input to the end of event value.
 */
Util.moveCursorToEnd = (event) => {
  var value = event.target.value;
  event.target.value = '';
  event.target.value = value;
}

/**
 * Returns a highlighted taxed based on an added search query (highlights the first occurrence).
 *
 * @param text text to be highlighted
 * @param query search query string
 */
Util.highlightInText = (text, query) => {
  var searchIndex = text.normalize('NFD').replace(/[\u0300-\u036f]/g, "").toLowerCase()
    .indexOf(query.normalize('NFD').replace(/[\u0300-\u036f]/g, "").toLowerCase());
  if (searchIndex === -1) {
    return text;
  } else {
    var textStart = text.substring(0, searchIndex),
        firstOccurrence = text.substring(searchIndex, searchIndex + query.length),
        textRest = text.substring(searchIndex + query.length);
    return <span>{textStart}<strong>{firstOccurrence}</strong>{textRest}</span>;
  }
}

/**
 * Creates a new contact info String from a given client
 *
 * @param client client to get contact info for
 */
Util.getContactInfo = (client) => {
    return (client.name + " " + client.surname + " (" + client.email + ")");
}

Util.FACILITIES_URL = "api/facilities/"; // url of facilities endpoint
Util.MASSAGES_URL = "api/massages/"; // url of massages endpoint
Util.CLIENTS_URL = "api/clients/"; // url of clients endpoint
Util.LOGOUT_URL = "api/logout/"; // url of logout endpoint
Util.REFRESH_MIN_TIME = 150; // refresh time for authorization tokens in milliseconds
Util.AUTO_REFRESH_TIME = 1000; // automatic update interval for Massages view in milliseconds
Util.CANCELLATION_LIMIT = 30; // cancellation limit before the start of a Massage in minutes
Util.MAX_MASSAGE_MINS = 120; // maximal minute time of Massages per client

export default Util
