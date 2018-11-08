// react imports
import React, { Component } from "react";
import PropTypes from "prop-types";

// module imports
import { Button, Tooltip } from "reactstrap";

// util imports
import _t from "../../util/Translations";
import Util from "../../util/Util";

/**
 * Icon only button that handles event addition to Google Calendar.
 */
class CalendarButton extends Component {
  state = { tooltipActive: false };

  tooltipTarget = Util.getTooltipTargets(1)[0];

  toggleTooltip = () => {
    this.setState(prevState => ({ tooltipActive: !prevState.tooltipActive }));
  };

  render() {
    return (
      <span>
        <Button
          id={this.tooltipTarget}
          outline
          style={{ border: "0px solid transparent" }}
          size="sm"
          tag="a"
          href={this.props.link}
          target="_blank"
          rel="noopener noreferrer"
          tabIndex="-1"
        >
          <span className="fas fa-calendar-plus" />
        </Button>
        <Tooltip isOpen={this.state.tooltipActive} target={this.tooltipTarget} toggle={this.toggleTooltip}>
          {_t.translate("Add to Google Calendar")}
        </Tooltip>
      </span>
    );
  }
}

CalendarButton.propTypes = {
  /** calendar link to redirect to */
  link: PropTypes.string
};

CalendarButton.defaultProps = {
  link: ""
};

export default CalendarButton;
