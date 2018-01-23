// react imports
import React, { Component } from 'react';
import PropTypes from 'prop-types';

// util imports
import _t from '../../util/Translations';

/**
 * Footer buttons for Modal dialogs. Children components can be given to add more
 * case specific elements.
 */
class ModalActions extends Component {

  render() {
    return (
      <div className="pull-right">
        {this.props.children}
        <button type="button" className="btn btn-primary" onClick={this.props.onProceed}
          style={{ 'marginRight': '5px' }} autoFocus={this.props.autoFocus}>
          {this.props.primaryLabel}
        </button>
        <button type="button" className="btn btn-default"
          onClick={this.props.onClose}>
          { _t.translate('Dismiss') }
        </button>
      </div>
    );
  }
}

ModalActions.propTypes = {
  /** primary button label */
  primaryLabel: PropTypes.string.isRequired,
  /** callback function triggered on primary button click */
  onProceed: PropTypes.func.isRequired,
  /** callback function triggered on close button click */
  onClose: PropTypes.func.isRequired,
  /** whether the primary button should be automatically focused */
  autoFocus: PropTypes.bool
};

ModalActions.defaultProps = {
  primaryLabel: _t.translate('Proceed'),
  autoFocus: false
};

export default ModalActions
