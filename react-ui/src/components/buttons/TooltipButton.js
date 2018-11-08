// react imports
import React, { Component } from "react";
import PropTypes from "prop-types";

// module imports
import { Button, Tooltip } from "reactstrap";

// util imports
import Util from "../../util/Util";

/**
 * An outline button component with an attached tooltip.
 */
class TooltipButton extends Component {
  state = { tooltipActive: false };

  tooltipTarget = Util.getTooltipTargets(1)[0];

  toggleTooltip = () => {
    this.setState(prevState => ({ tooltipActive: !prevState.tooltipActive }));
  };

  render() {
    const { disabled, label, tooltip, ...rest } = this.props;
    return (
      <span className="no-print">
        <Button {...rest} id={this.tooltipTarget} outline disabled={this.props.disabled}>
          {this.props.label}
        </Button>
        {this.props.tooltip !== "" &&
          !this.props.disabled && (
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

TooltipButton.propTypes = {
  /** function to be called on button click */
  onClick: PropTypes.func.isRequired,
  /** whether the button should be displayed as active or not */
  active: PropTypes.bool,
  /** whether the button should be disabled */
  disabled: PropTypes.bool,
  /** button label to be displayed */
  label: PropTypes.string,
  /** tooltip shown over the button */
  tooltip: PropTypes.string
};

TooltipButton.defaultProps = {
  active: false,
  disabled: false,
  label: "Click me",
  tooltip: ""
};

export default TooltipButton;
