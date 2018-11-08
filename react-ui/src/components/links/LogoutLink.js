// react imports
import React, { Component } from "react";

// module imports
import { NavLink } from "reactstrap";

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
      <NavLink onClick={this.logout} style={{ cursor: "pointer" }}>
        <span className="fas fa-sign-out-alt" />
        &nbsp;
        {_t.translate("Logout")}
      </NavLink>
    );
  }
}

export default LogoutLink;
