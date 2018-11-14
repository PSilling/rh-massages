/**
 * Utility class containing functions for client-server communication using the Fetch API.
 */

// util imports
import _t from "./Translations";
import Auth from "./Auth";
import Util from "./Util";

const Fetch = function Fetch() {};

/**
 * Fetches data from a given endpoint.
 * @param url             defined endpoint
 * @param update          callback function to update the resources
 */
Fetch.get = (url, update) => {
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
 * @param url             defined endpoint
 * @param data            data to send
 * @param update          callback function to update the resources
 * @param notify          false if success notifications should be suppressed
 */
Fetch.post = (url, data, update, notify = true) => {
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
 * @param url             defined endpoint
 * @param data            data to send
 * @param update          callback function to update the resources
 * @param notify          false if success notifications should be suppressed
 */
Fetch.put = (url, data, update, notify = true) => {
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
 * @param url             defined endpoint
 * @param update          callback function to update the resources
 * @param notify          false if success notifications should be suppressed
 */
Fetch.delete = (url, update, notify = true) => {
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

export default Fetch;
