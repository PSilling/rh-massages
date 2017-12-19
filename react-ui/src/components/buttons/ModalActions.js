// react imports
import React, { Component } from 'react';

// util imports
import _t from '../../util/Translations';

/**
 * Custom component rendering action buttons for modal footers.
 */
class ModalActions extends Component {

  render() {
    return(
      <div className="pull-right">
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

export default ModalActions
