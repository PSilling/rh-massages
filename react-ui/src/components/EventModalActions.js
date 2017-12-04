// react imports
import React, { Component } from 'react';

// util imports
import _t from '../utils/Translations.js';

/**
 * Custom component rendering action buttons for modal footers.
 * Has a bonus button handling a second proceed event.
 */
class EventModalActions extends Component {

  render() {
    return(
      <div className="pull-right">
        <button type="button" className="btn btn-primary"
          onClick={this.props.onProceedWithEvent} style={{ 'marginRight': '5px' }}>
          {this.props.primaryWithEventLabel}
        </button>
        <button type="button" className="btn btn-primary" onClick={this.props.onProceed}
          style={{ 'marginRight': '5px' }} autoFocus>
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

export default EventModalActions
