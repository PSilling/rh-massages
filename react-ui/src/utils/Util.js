import _t from './Translations';
import { NotificationManager } from 'react-notifications';

var Util = function() { };

/**
 * Checks whether an object is null or undefined
 * @param  object to check
 * @return boolean
 */
Util.isEmpty = function(object) {
  return (object === null) || (typeof object === 'undefined')
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
  fetch(url, {
    credentials: 'same-origin',
    method: 'get'
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
}

/**
 * Creates a new element at a given endpoint.
 * @param url             defined endpoint
 * @param data            data to send
 * @param update          callback function to update the resources
 */
Util.post = (url, data, update) => {
  console.log(data);
  fetch(url, {
    credentials: 'same-origin',
    method: 'post',
    headers: { "Content-Type" : "application/json" },
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
}

/**
 * Edits an element at a given endpoint.
 * @param url             defined endpoint
 * @param data            data to send
 * @param update          callback function to update the resources
 */
Util.put = (url, data, update) => {
  console.log(data);
  fetch(url, {
    credentials: 'same-origin',
    method: 'put',
    headers: { "Content-Type" : "application/json" },
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
}

/**
 * Deletes an element at a given endpoint.
 * @param url             defined endpoint
 * @param update          callback function to update the resources
 */
Util.delete = (url, update) => {
  fetch(url, {
    credentials: 'same-origin',
    method: 'delete'
  }).then(function(response) {
    if (response.ok) {
      Util.notify("success", "", _t.translate('Your request has been successful.'));
      update();
    } else {
      Util.notify("error", _t.translate('Your request has ended unsuccessfully.'),
        _t.translate('An error occured!'));
    }
  });
}

Util.FACILITIES_URL = "http://localhost:8080/facilities/";
Util.MASSAGES_URL = "http://localhost:8080/massages/";
Util.USERS_URL = "http://localhost:8080/users/";

export default Util
