// react imports
import React from "react";

// module imports
import { NavLink } from "reactstrap";

// util imports
import Auth from "../../util/Auth";
import _t from "../../util/Translations";

/**
 * Link that redirects to Keycloak logout and the application after server logout.
 */
const LogoutLink = function LogoutLink() {
  return (
    <NavLink onClick={Auth.keycloak.logout} style={{ cursor: "pointer" }}>
      <span className="fas fa-sign-out-alt" />
      &nbsp;
      {_t.translate("Logout")}
    </NavLink>
  );
};

export default LogoutLink;
