// react imports
import React, { Component } from "react";

// module imports
import { NavLink, Tooltip } from "reactstrap";

// util imports
import Auth from "../../util/Auth";
import _t from "../../util/Translations";
import Util from "../../util/Util";

/**
 * Link that redirects to Keycloak account management.
 */
class ProfileLink extends Component {
  state = { tooltipActive: false };

  tooltipTarget = Util.getTooltipTargets(1)[0];

  toggleTooltip = () => {
    this.setState(prevState => ({ tooltipActive: !prevState.tooltipActive }));
  };

  viewProfile = () => {
    Auth.keycloak.accountManagement();
  };

  render() {
    return (
      <span>
        <NavLink id={this.tooltipTarget} onClick={this.viewProfile} style={{ cursor: "pointer" }}>
          <span className="fas fa-user-circle" />
          &nbsp;
          {_t.translate("Profile")}
        </NavLink>
        <Tooltip isOpen={this.state.tooltipActive} target={this.tooltipTarget} toggle={this.toggleTooltip}>
          {_t.translate("Show Keycloak profile")}
        </Tooltip>
      </span>
    );
  }
}

export default ProfileLink;
