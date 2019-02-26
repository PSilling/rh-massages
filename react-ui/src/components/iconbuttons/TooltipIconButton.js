// react imports
import React, { Component } from "react";
import PropTypes from "prop-types";

// module imports
import { Button, Tooltip } from "reactstrap";

// util imports
import Util from "../../util/Util";

/**
 * Labeless icon only button with an attached tooltip.
 */
class TooltipIconButton extends Component {
  state = { tooltipActive: false };

  tooltipTarget = Util.getTooltipTargets(1)[0];

  toggleTooltip = () => {
    this.setState(prevState => ({ tooltipActive: !prevState.tooltipActive }));
  };

  render() {
    const { disabled, icon, ...rest } = this.props;
    return (
      <span className="no-print">
        <Button {...rest} id={this.tooltipTarget} outline disabled={this.props.disabled}>
          <span className={`fas fa-${this.props.icon}`} />
        </Button>
        {this.props.tooltip !== "" && !this.props.disabled && (
          <Tooltip
            isOpen={this.state.tooltipActive}
            target={this.tooltipTarget}
            toggle={this.toggleTooltip}
            trigger="hover"
          >
            {this.props.tooltip}
          </Tooltip>
        )}
      </span>
    );
  }
}

TooltipIconButton.propTypes = {
  /** icon to be shown instead of a normal label */
  icon: PropTypes.string.isRequired,
  /** function to be called on button click */
  onClick: PropTypes.func.isRequired,
  /** whether the button should be disabled */
  disabled: PropTypes.bool,
  /** button size class */
  size: PropTypes.string,
  /** button component style */
  style: PropTypes.shape({
    border: PropTypes.string
  }),
  /** tooltip to be shown on button hover */
  tooltip: PropTypes.string
};

TooltipIconButton.defaultProps = {
  disabled: false,
  size: "sm",
  style: { border: "0px solid transparent" },
  tooltip: ""
};

export default TooltipIconButton;
