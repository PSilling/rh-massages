/**
 * Utility class containing functions for client-server communication using the Fetch API or the WebSocket API.
 */

// module imports
import moment from "moment";

// util imports
import _t from "./Translations";
import Auth from "./Auth";
import Util from "./Util";

// const WebSocket = require('ws');
const Fetch = function Fetch() {};

/**
 * Fetches data from a given endpoint.
 * @param url             defined endpoint
 * @param update          callback function to update the resources
 */
Fetch.get = (url, update = () => {}) => {
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
          console.error("Could not retrieve any data from server! Response: ", response); /* eslint-disable-line */
          return undefined;
        })
        .catch(error => {
          /* eslint-disable-next-line */
          console.error("An unexpected error occurred during the 'GET' request!", error.toString());
          Util.notify(
            "error",
            error.toString(),
            _t.translate("An unexpected error occurred during the 'GET' request!")
          );
        })
        .then(json => {
          update(json);
        });
    })
    .error(() => {
      console.error("Failed to refresh the Keycloak user token!"); /* eslint-disable-line */
      Auth.keycloak.login();
    });
};

/**
 * Creates a new element at a given endpoint.
 * @param url             defined endpoint
 * @param data            data to send
 * @param update          callback function to update the resources
 * @param notify          false if success notifications should be suppressed
 */
Fetch.post = (url, data, update = () => {}, notify = true) => {
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
          console.error("Server responsed with an error response:", response); /* eslint-disable-line */
        }
      });
    })
    .error(() => {
      console.log("Failed to refresh the Keycloak user token!"); /* eslint-disable-line */
      Auth.keycloak.login();
    });
};

/**
 * Edits an element at a given endpoint.
 * @param url             defined endpoint
 * @param data            data to send
 * @param update          callback function to update the resources
 * @param notify          false if success notifications should be suppressed
 * @param onError         function that replaces (if not null) standard error notification
 */
Fetch.put = (url, data, update = () => {}, notify = true, onError = null) => {
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
          if (onError == null) {
            Util.notify(
              "error",
              _t.translate("Your request has ended unsuccessfully."),
              _t.translate("An error occured!")
            );
          } else {
            onError();
          }
          console.error("Server responsed with an error response:", response); /* eslint-disable-line */
        }
      });
    })
    .error(() => {
      console.log("Failed to refresh the Keycloak user token!"); /* eslint-disable-line */
      Auth.keycloak.login();
    });
};

/**
 * Deletes an element at a given endpoint.
 * @param url             defined endpoint
 * @param update          callback function to update the resources
 * @param notify          false if success notifications should be suppressed
 */
Fetch.delete = (url, update = () => {}, notify = true) => {
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
          console.error("Server responsed with an error response:", response); /* eslint-disable-line */
        }
      });
    })
    .error(() => {
      console.log("Failed to refresh the Keycloak user token!"); /* eslint-disable-line */
      Auth.keycloak.login();
    });
};

/**
 * Creates a new WebSocket connection, subscribing to a given URL address. Drops the action if the active WebSocket
 * is trying to connect and was created before the connection timeout limit expired.
 * @see https://github.com/sockjs/sockjs-client for more information about the library.
 * @param webSocketUrl    end of the URL address to subscribe to
 * @return                the created WebSocket
 */
Fetch.subscribeToUrl = webSocketUrl => {
  if (
    Fetch.WEBSOCKET_START_TIME !== null &&
    Fetch.WEBSOCKET.readyState === WebSocket.CONNECTING &&
    moment.duration(moment().diff(Fetch.WEBSOCKET_START_TIME)).asMilliseconds() < Util.WEBSOCKET_TIMEOUT_LIMIT
  ) {
    return Fetch.WEBSOCKET;
  }

  Fetch.WEBSOCKET_AUTHENTICATED = false;
  Fetch.WEBSOCKET_START_TIME = moment();
  const webSocket = new WebSocket(webSocketUrl);

  webSocket.addEventListener("message", event => {
    if (!Fetch.WEBSOCKET_AUTHENTICATED) {
      Fetch.post(
        Util.WEBSOCKETS_URL,
        event.data,
        () => {
          Fetch.WEBSOCKET_AUTHENTICATED = true;
        },
        false
      );
      return;
    }

    // parse the message; format: OPERATION_STATUS or OPERATION_SUBSCRIPTION_DATA
    const operation = event.data.substring(0, event.data.indexOf("_"));
    const remainder = event.data.substring(event.data.indexOf("_") + 1, event.data.length);
    const subscription = remainder.substring(0, remainder.indexOf("_"));

    // send the message to the subscription matching callback function
    if (subscription !== "") {
      const callback = Fetch.WEBSOCKET_CALLBACKS[subscription.toLowerCase()];
      if (typeof callback === "function") {
        callback(operation, JSON.parse(remainder.substring(remainder.indexOf("_") + 1)));
      }
    }
  });

  webSocket.addEventListener("error", event => {
    console.log("WebSocket error. Message: ", event.data); /* eslint-disable-line */
  });

  return webSocket;
};

/**
 * Tries to send a message using the global WebSocket connection. Waits until the WebSocket is ready
 * if unauthenticated or closed (based on retry count and timeout limitations).
 * @param message     the message to be sent
 */
Fetch.tryWebSocketSend = message => {
  if (!Fetch.WEBSOCKET_AUTHENTICATED) {
    setTimeout(() => Fetch.tryWebSocketSend(message), 50);
    return;
  }

  if (Fetch.WEBSOCKET.readyState === WebSocket.OPEN) {
    Fetch.WEBSOCKET.send(message);
  } else {
    const timeouts = [];

    if (Fetch.WEBSOCKET.readyState === WebSocket.CLOSED) {
      Fetch.WEBSOCKET_AUTHENTICATED = false;
    }

    for (let i = 0; i <= Util.WEBSOCKET_RETRY_COUNT; i++) {
      timeouts[i] = setTimeout(() => {
        if (Fetch.WEBSOCKET.readyState === WebSocket.OPEN) {
          Fetch.WEBSOCKET.send(message);
          for (let j = i + 1; j < timeouts.length; j++) {
            clearTimeout(timeouts[j]);
          }
        } else {
          Fetch.WEBSOCKET = Fetch.subscribeToUrl(Util.WEBSOCKET_PROTOCOL_URL);
        }
      }, Util.WEBSOCKET_TIMEOUT_LIMIT * i * i);
    }
  }
};

/** whether the current WebSocket connection is authenticated */
Fetch.WEBSOCKET_AUTHENTICATED = false;
/** connection start time (as a moment) for the current WebSocket */
Fetch.WEBSOCKET_START_TIME = null;
/** global WebSocket connection */
Fetch.WEBSOCKET = Fetch.subscribeToUrl(Util.WEBSOCKET_PROTOCOL_URL);
/** global WebSocket callback object with subscription info before each callback */
Fetch.WEBSOCKET_CALLBACKS = {
  client: null,
  facility: null,
  massage: null
};
/** WebSocket ADD operation code (for POST) */
Fetch.OPERATION_ADD = "ADD";
/** WebSocket CHANGE operation code (for PUT) */
Fetch.OPERATION_CHANGE = "CHANGE";
/** WebSocket REMOVE operation code (for DELETE) */
Fetch.OPERATION_REMOVE = "REMOVE";

export default Fetch;
