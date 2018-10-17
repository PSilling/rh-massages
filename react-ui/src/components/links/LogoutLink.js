// react imports
import React, { Component } from "react";

// util imports
import Auth from "../../util/Auth";
import _t from "../../util/Translations";
import Util from "../../util/Util";

/**
 * Link that redirects to Keycloak logout and the application after server logout.
 */
class LogoutLink extends Component {
  logout = () => {
    fetch(Util.LOGOUT_URL, {
      method: "get",
      headers: {
        Authorization: `Bearer ${Auth.getToken()}`
      }
    }).then(response => {
      if (response.ok) {
        Auth.keycloak.logout();
      } else {
        Util.notify(
          "error",
          _t.translate("Your request has ended unsuccessfully."),
          _t.translate("An error occurred!")
        );
      }
    });
  };

  render() {
    return (
      <button type="button" className="btn btn-link navbar-btn" onClick={this.logout}>
        <span className="glyphicon glyphicon-log-out" />
        &nbsp;
        {_t.translate("Logout")}
      </button>
    );
  }
}

export default LogoutLink;
