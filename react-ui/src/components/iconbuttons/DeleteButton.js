// react imports
import React, { Component } from "react";
import PropTypes from "prop-types";

// component imports
import ConfirmationModal from "../modals/ConfirmationModal";

// util imports
import _t from "../../util/Translations";

/**
 * Icon only button used for element deletion. Contains a ConfirmationModal to confirm
 * the action.
 */
class DeleteButton extends Component {
  state = { active: false };

  handleToggle = () => {
    this.setState(prevState => ({ active: !prevState.active }));
  };

  render() {
    return (
      <span>
        <button
          style={{ color: "#000" }}
          type="button"
          className="btn btn-link"
          onClick={this.handleToggle}
          title={_t.translate("Delete")}
        >
          <span className="glyphicon glyphicon-trash" />
        </button>
        {this.state.active ? (
          <ConfirmationModal
            message={_t.translate("Are you sure? This action cannot be reverted.")}
            onClose={this.handleToggle}
            onConfirm={() => {
              this.handleToggle();
              this.props.onDelete();
            }}
          />
        ) : (
          ""
        )}
      </span>
    );
  }
}

DeleteButton.propTypes = {
  /** function to be called on button click */
  onDelete: PropTypes.func.isRequired
};

export default DeleteButton;
