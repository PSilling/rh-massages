/**
 * Utility class containing functions for client-server communication using the Fetch API or the WebSocket API.
 */

// react imports
import React from "react";

// module imports
import { Button, Row, Col } from "reactstrap";
import moment from "moment";

// util imports
import _t from "./Translations";
import Auth from "./Auth";
import Util from "./Util";

// const WebSocket = require('ws');
const Fetch = function Fetch() {};

/**
 * Create a new operation postponement notification. This notification can ten be used to cancel the delayed operation.
 * @param  postponeData   valid postponement data object
 * @param  timeout        running operation timeout
 * @param  delay          operation delay in milliseconds
 * @param  operation      the postponed operation as a function
 */
Fetch.handlePostponement = (postponeData, timeout, delay, operation) => {
  const title = Util.isEmpty(postponeData.title) ? "" : postponeData.title;
  const message = Util.isEmpty(postponeData.message)
    ? _t.translate("Your request will be sent after a while.")
    : postponeData.message;
  const skipRequestDelay = () => {
    clearTimeout(timeout);
    operation();
  };

  Util.notify(
    "info",
    <div>
      <Row>
        <Col md="12">
          <strong>{message}</strong>
        </Col>
      </Row>
      <Row>
        <Col md="12">
          <div className="mt-2 float-right">
            <Button className="mr-2" color="info" size="sm" onClick={skipRequestDelay}>
              {_t.translate("Send now")}
            </Button>
            <Button color="info" size="sm" onClick={() => clearTimeout(timeout)}>
              {_t.translate("Cancel")}
            </Button>
          </div>
        </Col>
      </Row>
    </div>,
    title,
    delay
  );
};

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
 * @param postponeData    data object containing information about postponement of the request; null if no postponement
 *                        should be shown, otherwise should be an object with notification duration 'delay',
 *                        notification title 'title' and notification message 'message' attributes
 */
Fetch.post = (url, data, update = () => {}, notify = true, postponeData = null) => {
  // Create the request handler for future use.
  const sendRequest = () => {
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

  // If applicable, create the postponement notification and delay the request. If not applicable, send the request.
  if (
    postponeData !== null &&
    (Auth.isAdmin() || Auth.isMasseur()) &&
    localStorage.getItem(`skipPostponement-${Auth.getSub()}`) === null
  ) {
    const delay = Util.isEmpty(postponeData.delay) ? 5000 : postponeData.delay;
    const timeout = setTimeout(() => sendRequest(), delay);
    Fetch.handlePostponement(postponeData, timeout, delay, sendRequest);
  } else {
    sendRequest();
  }
};

/**
 * Edits an element at a given endpoint.
 * @param url             defined endpoint
 * @param data            data to send
 * @param update          callback function to update the resources
 * @param notify          false if success notifications should be suppressed
 * @param onError         function that replaces (if not null) standard error notification
 * @param postponeData    data object containing information about postponement of the request; null if no postponement
 *                        should be shown, otherwise should be an object with notification duration 'delay',
 *                        notification title 'title' and notification message 'message' attributes
 */
Fetch.put = (url, data, update = () => {}, notify = true, onError = null, postponeData = null) => {
  // Create the request handler for future use.
  const sendRequest = () => {
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

  // If applicable, create the postponement notification and delay the request. If not applicable, send the request.
  if (
    postponeData !== null &&
    (Auth.isAdmin() || Auth.isMasseur()) &&
    localStorage.getItem(`skipPostponement-${Auth.getSub()}`) === null
  ) {
    const delay = Util.isEmpty(postponeData.delay) ? 5000 : postponeData.delay;
    const timeout = setTimeout(() => sendRequest(), delay);
    Fetch.handlePostponement(postponeData, timeout, delay, sendRequest);
  } else {
    sendRequest();
  }
};

/**
 * Deletes an element at a given endpoint.
 * @param url             defined endpoint
 * @param update          callback function to update the resources
 * @param notify          false if success notifications should be suppressed
 * @param postponeData    data object containing information about postponement of the request; null if no postponement
 *                        should be shown, otherwise should be an object with notification duration 'delay',
 *                        notification title 'title' and notification message 'message' attributes
 */
Fetch.delete = (url, update = () => {}, notify = true, postponeData = null) => {
  const sendRequest = () => {
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

  // If applicable, create the postponement notification and delay the request. If not applicable, send the request.
  if (
    postponeData !== null &&
    (Auth.isAdmin() || Auth.isMasseur()) &&
    localStorage.getItem(`skipPostponement-${Auth.getSub()}`) === null
  ) {
    const delay = Util.isEmpty(postponeData.delay) ? 5000 : postponeData.delay;
    const timeout = setTimeout(() => sendRequest(), delay);
    Fetch.handlePostponement(postponeData, timeout, delay, sendRequest);
  } else {
    sendRequest();
  }
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
