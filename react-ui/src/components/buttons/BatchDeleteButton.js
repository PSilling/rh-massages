// react imports
import React, { Component } from "react";
import PropTypes from "prop-types";

// component imports
import ConfirmationModal from "../modals/ConfirmationModal";

// util imports
import _t from "../../util/Translations";

/**
 * A button used for batch Massage deletion. Contains a ConfirmationModal to confirm
 * the action.
 */
class BatchDeleteButton extends Component {
  state = { active: false };

  handleToggle = () => {
    this.setState(prevState => ({ active: !prevState.active }));
  };

  render() {
    return (
      <span>
        <button type="button" className="btn btn-default" onClick={this.handleToggle} disabled={this.props.disabled}>
          {this.props.label}
        </button>
        {this.state.active && (
          <ConfirmationModal
            message={_t.translate("Are you sure? This action cannot be reverted.")}
            onClose={this.handleToggle}
            onConfirm={() => {
              this.handleToggle();
              this.props.onDelete();
            }}
          />
        )}
      </span>
    );
  }
}

BatchDeleteButton.propTypes = {
  /** function to be called on action confirmation */
  onDelete: PropTypes.func.isRequired,
  /** whether the button should be disabled */
  disabled: PropTypes.bool,
  /** button label to be displayed */
  label: PropTypes.string
};

BatchDeleteButton.defaultProps = {
  disabled: false,
  label: "Delete"
};

export default BatchDeleteButton;
