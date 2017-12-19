// react imports
import React, { Component } from 'react';
import ReactDOM from 'react-dom';

// component imports
import ModalActions from '../buttons/ModalActions';

// module imports
import {ModalContainer, ModalDialog} from 'react-modal-dialog';

// util imports
import _t from '../../util/Translations';

/**
 * Custom confirmation modal component.
 */
class ConfirmationModal extends Component {

  handleKeyPress = (event) => {
    if (event.charCode === 13 && document.activeElement === ReactDOM.findDOMNode(this.modalDialog)) {
      this.props.onConfirm();
    }
  }

  render() {
    return(
      <ModalContainer onClose={this.props.onClose}>
        <ModalDialog onClose={this.props.onClose} width="40%" style={{ 'outline': 'none' }}
          tabIndex="1" onKeyPress={this.handleKeyPress}
          ref={(dialog) => {
            this.modalDialog = dialog;
          }}>
          <h3>{ _t.translate('Action confirmation') }</h3>
          <p>{this.props.message}</p>
          <ModalActions
            primaryLabel={ _t.translate('Proceed') }
            onProceed={this.props.onConfirm}
            onClose={this.props.onClose}
            autoFocus={true}
          />
        </ModalDialog>
      </ModalContainer>
    )
  }
}

export default ConfirmationModal
