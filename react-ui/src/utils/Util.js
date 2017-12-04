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
 */
Util.post = (url, data, update) => {
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
        Util.notify("success", "", _t.translate('Your request has been successful.'));
        update();
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
 */
Util.put = (url, data, update) => {
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
        Util.notify("success", "", _t.translate('Your request has been successful.'));
        update();
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
 */
Util.delete = (url, update) => {
  Auth.keycloak.updateToken(Util.REFRESH_MIN_TIME).success(function() {
    fetch(url, {
      method: 'delete',
      credentials: 'same-origin',
      headers: {
        "Authorization" : "bearer " + Auth.getToken()
      }
    }).then(function(response) {
      if (response.ok) {
        Util.notify("success", "", _t.translate('Your request has been successful.'));
        update();
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
  url += "/" + moment.utc(massage.date).add(1, 'h').format("YYYYMMDDTHHmmssZ").replace("+00:00", "Z");
  url += "&details=" + _t.translate('Masseuse') + ' ' + massage.masseuse;

  window.open(url,"_blank");
}

Util.FACILITIES_URL = "api/facilities/";
Util.MASSAGES_URL = "api/massages/";
Util.LOGOUT_URL = "api/logout/";
Util.REFRESH_MIN_TIME = 150;
Util.AUTO_REFRESH_TIME = 10000;

export default Util
