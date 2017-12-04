// react imports
import React, { Component } from 'react';
import ReactDOM from 'react-dom';

// component imports
import EventModalActions from './EventModalActions';

// module imports
import {ModalContainer, ModalDialog} from 'react-modal-dialog';

// util imports
import _t from '../utils/Translations.js';

/**
 * Custom confirmation modal component.
 */
class AssignConfirmationModal extends Component {

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
          <EventModalActions
            primaryWithEventLabel={ _t.translate('Proceed and add to calendar') }
            onProceedWithEvent={this.props.onConfirmWithEvent}
            primaryLabel={ _t.translate('Proceed') }
            onProceed={this.props.onConfirm}
            onClose={this.props.onClose}
          />
        </ModalDialog>
      </ModalContainer>
    )
  }
}

export default AssignConfirmationModal
