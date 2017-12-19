import moment from 'moment';

import _t from './Translations';
import { NotificationManager } from 'react-notifications';
import Auth from './Auth';

var Util = function() { };

/**
 * Checks whether an object is null or undefined
 * @param  object to check
 * @return boolean
 */
Util.isEmpty = function(object) {
  return (object === null) || (typeof object === 'undefined') || (object === '')
}

/**
 * Checks whether an array is the same as an another array (without nesting).
 * @param  array1 array to check
 * @param  array2 array to compare array1 with
 * @return boolean
 */
Util.arraysEqual = function(array1, array2) {
  if (Util.isEmpty(array1) || Util.isEmpty(array2)) {
    return false;
  }

  if (array1.length !== array2.length) {
    return false;
  }

  for (var i = 0; i < array1.length; i++) {
    if (array1[i] !== array2[i] && JSON.stringify(array1[i]) !== JSON.stringify(array2[i])) {
      return false;
    }
  }
  return true;
}

/**
 * Creates a new notification.
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
      console.log(json);
      update(json);
    });
  }).error(function() {
    console.log('Failed to refresh the token!');
    Auth.keycloak.login();
  });
}

/**
 * Creates a new element at a given endpoint.
 * @param url             defined endpoint
 * @param data            data to send
 * @param update          callback function to update the resources
 * @param notify          false if success notifications should be suppressed
 */
Util.post = (url, data, update, notify = true) => {
  Auth.keycloak.updateToken(Util.REFRESH_MIN_TIME).success(function() {
    console.log(data);
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
    console.log(data);
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

Util.FACILITIES_URL = "http://localhost:8080/api/facilities/";
Util.MASSAGES_URL = "http://localhost:8080/api/massages/";
Util.LOGOUT_URL = "http://localhost:8080/api/logout/";
Util.REFRESH_MIN_TIME = 150;
Util.AUTO_REFRESH_TIME = 1000;
Util.CANCELLATION_LIMIT = 30;
Util.MAX_MASSAGE_MINS = 120;
Util.MASSAGES_PER_PAGE = 12;

export default Util
