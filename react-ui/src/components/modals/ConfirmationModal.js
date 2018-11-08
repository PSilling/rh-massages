// react imports
import React, { Component } from "react";
import PropTypes from "prop-types";

// module imports
import { Col, Row, Modal, ModalBody } from "reactstrap";

// component imports
import ModalActions from "../buttons/ModalActions";

// util imports
import _t from "../../util/Translations";

/**
 * Modal with a simple action confirmation message and ModalActions.
 */
class ConfirmationModal extends Component {
  handleKeyPress = event => {
    if (event.key === "Enter" && document.activeElement.tabIndex === -1) {
      this.props.onConfirm();
    }
  };

  createInsides = () => (
    <ModalBody>
      <Row>
        <Col md="12">
          <h3>{_t.translate("Action confirmation")}</h3>
          <hr />
        </Col>
      </Row>
      <Row>
        <Col md="12">{this.props.message}</Col>
      </Row>
      <ModalActions onProceed={this.props.onConfirm} onClose={this.props.onClose}>
        {this.props.children}
      </ModalActions>
    </ModalBody>
  );

  render() {
    return this.props.withPortal ? (
      <Modal isOpen toggle={this.props.onClose} tabIndex="-1" onKeyPress={this.handleKeyPress}>
        {this.createInsides()}
      </Modal>
    ) : (
      this.createInsides()
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
