// react imports
import React, { Component } from 'react';
import PropTypes from 'prop-types';

// util imports
import _t from '../../util/Translations';

/**
 * Bootsrap information alert panel for basic information distribution.
 */
class InfoAlert extends Component {

  render() {
    return (
      <div className="alert alert-info alert-dismissible" style={{ 'marginBottom': '15px' }}>
        <button type="button" className="close" aria-label="Close"
          onClick={this.props.onClose} title={ _t.translate('Close') }>
          <span aria-hidden="true">&times;</span>
        </button>
        {this.props.children}
      </div>
    )
  }
}

InfoAlert.propTypes = {
  /** function to be called on dismiss */
  onClose: PropTypes.func.isRequired
};

export default InfoAlert
