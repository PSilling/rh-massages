// react imports
import React, { Component } from "react";
import PropTypes from "prop-types";

// component imports
import ConfirmationModal from "../modals/ConfirmationModal";
import TooltipButton from "./TooltipButton";

// util imports
import _t from "../../util/Translations";

/**
 * A TooltipButton with a ConfirmationModal beside it.
 */
class ConfirmationButton extends Component {
  state = { active: false };

  handleToggle = () => {
    this.setState(prevState => ({ active: !prevState.active }));
  };

  render() {
    const { onConfirm, dialogMessage, ...rest } = this.props;
    return (
      <span>
        <TooltipButton {...rest} onClick={this.handleToggle} />
        {this.state.active && (
          <ConfirmationModal
            message={this.props.dialogMessage}
            onClose={this.handleToggle}
            onConfirm={() => {
              this.handleToggle();
              this.props.onConfirm();
            }}
          />
        )}
      </span>
    );
  }
}

ConfirmationButton.propTypes = {
  /** function to be called on action confirmation */
  onConfirm: PropTypes.func.isRequired,
  /** message disabled in the ConfirmationModal */
  dialogMessage: PropTypes.string,
  /** whether the button should be disabled */
  disabled: PropTypes.bool,
  /** button label to be displayed */
  label: PropTypes.string,
  /** tooltip shown over the button */
  tooltip: PropTypes.string
};

ConfirmationButton.defaultProps = {
  dialogMessage: _t.translate("Are you sure? This action cannot be reverted."),
  disabled: false,
  label: "Delete",
  tooltip: "Delete"
};

export default ConfirmationButton;
