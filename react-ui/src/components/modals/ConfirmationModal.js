// react imports
import React, { Component } from "react";
import ReactDOM from "react-dom";
import PropTypes from "prop-types";

// module imports
import { ModalContainer, ModalDialog } from "react-modal-dialog";

// component imports
import ModalActions from "../buttons/ModalActions";

// util imports
import _t from "../../util/Translations";

/**
 * Modal with a simple action confirmation message and ModalActions.
 */
class ConfirmationModal extends Component {
  handleKeyPress = event => {
    if (event.charCode === 13 && document.activeElement === ReactDOM.findDOMNode(this.modal)) {
      this.props.onConfirm();
    }
  };

  renderInsides = () => (
    <div>
      <h3>{_t.translate("Action confirmation")}</h3>
      <p>{this.props.message}</p>
      <ModalActions onProceed={this.props.onConfirm} onClose={this.props.onClose} autoFocus>
        {this.props.children}
      </ModalActions>
    </div>
  );

  render() {
    return this.props.withPortal ? (
      <ModalContainer onClose={this.props.onClose}>
        <ModalDialog
          onClose={this.props.onClose}
          width="40%"
          style={{ outline: "none" }}
          tabIndex="-1"
          onKeyPress={this.handleKeyPress}
          ref={dialog => {
            this.modalDialog = dialog;
          }}
        >
          {this.renderInsides()}
        </ModalDialog>
      </ModalContainer>
    ) : (
      this.renderInsides()
    );
  }
}

ConfirmationModal.propTypes = {
  /** children supplied to ModalActions */
  children: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.node), PropTypes.node]),
  /** message in the Modal */
  message: PropTypes.string.isRequired,
  /** callback function triggered on Modal close */
  onClose: PropTypes.func.isRequired,
  /** callback function triggered on primary button click */
  onConfirm: PropTypes.func.isRequired,
  /** whether ModalContainer should be used; useful for testing to avoid portals */
  withPortal: PropTypes.bool
};

ConfirmationModal.defaultProps = {
  children: null,
  withPortal: true
};

export default ConfirmationModal;
