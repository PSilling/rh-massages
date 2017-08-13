// react imports
import React, { Component } from 'react';

// component imports
import ModalActions from './ModalActions';

// module imports
import {ModalContainer, ModalDialog} from 'react-modal-dialog';

// util imports
import _t from '../utils/Translations.js';

/**
 * Custom confirmation modal component.
 */
class ConfirmationModal extends Component {

  render() {
    return(
      <ModalContainer onClose={this.props.onClose}>
        <ModalDialog onClose={this.props.onClose} width="40%">
            <h3>{ _t.translate('Action confirmation') }</h3>
            <p>{this.props.message}</p>
            <ModalActions
              primaryLabel={ _t.translate('Proceed') }
              onProceed={this.props.onConfirm}
              onClose={this.props.onClose}
            />
          </ModalDialog>
      </ModalContainer>
    )
  }
}

export default ConfirmationModal
