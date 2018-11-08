// react imports
import React, { Component } from "react";

// module imports
import { NavLink, Tooltip } from "reactstrap";

// util imports
import _t from "../../util/Translations";
import Util from "../../util/Util";

/**
 * Link for language switching.
 */
class LangLink extends Component {
  state = { tooltipActive: false };

  tooltipTarget = Util.getTooltipTargets(1)[0];

  toggleTooltip = () => {
    this.setState(prevState => ({ tooltipActive: !prevState.tooltipActive }));
  };

  changeLanguage = () => {
    const locale = localStorage.getItem("sh-locale") === "en" ? "cs" : "en";
    localStorage.setItem("sh-locale", locale);
    _t.setLocale(locale);
    window.location.reload();
  };

  render() {
    return (
      <span>
        <NavLink id={this.tooltipTarget} onClick={this.changeLanguage} style={{ cursor: "pointer" }}>
          <span className="fas fa-globe-americas" />
          &nbsp;
          {localStorage.getItem("sh-locale") === "en" ? "CZ" : "EN"}
        </NavLink>
        <Tooltip isOpen={this.state.tooltipActive} target={this.tooltipTarget} toggle={this.toggleTooltip}>
          {_t.translate("Change language to czech")}
        </Tooltip>
      </span>
    );
  }
}

export default LangLink;
