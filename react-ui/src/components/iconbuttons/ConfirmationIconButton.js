// react imports
import React, { Component } from "react";
import PropTypes from "prop-types";

// component imports
import ConfirmationModal from "../modals/ConfirmationModal";
import TooltipIconButton from "./TooltipIconButton";

// util imports
import _t from "../../util/Translations";

/**
 * TooltipIconButton with an action ConfirmationModal.
 */
class ConfirmationIconButton extends Component {
  state = { active: false };

  handleToggle = () => {
    this.setState(prevState => ({ active: !prevState.active }));
  };

  render() {
    const { onConfirm, dialogMessage, ...rest } = this.props;
    return (
      <span>
        <TooltipIconButton {...rest} onClick={this.handleToggle} />
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

ConfirmationIconButton.propTypes = {
  /** function to be called on action confirmation */
  onConfirm: PropTypes.func.isRequired,
  /** message disabled in the ConfirmationModal */
  dialogMessage: PropTypes.string
};

ConfirmationIconButton.defaultProps = {
  dialogMessage: _t.translate("Are you sure? This action cannot be reverted.")
};

export default ConfirmationIconButton;
