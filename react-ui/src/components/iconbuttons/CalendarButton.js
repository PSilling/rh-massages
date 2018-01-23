// react imports
import React, { Component } from 'react';
import PropTypes from 'prop-types';

// util imports
import _t from '../../util/Translations';

/**
 * Icon only button that handles event addition to Google Calendar.
 */
class CalendarButton extends Component {

  render() {
    return (
      <span>
        <button disabled={this.props.disabled} style={{ 'color': '#000' }}  type="button"
          className="btn btn-link" onClick={this.props.onAdd} title={ _t.translate("Add to Google Calendar") }>
          <span className="glyphicon glyphicon-calendar"></span>
        </button>
      </span>
    );
  }
}

CalendarButton.propTypes = {
  /** function to be called on action confirmation */
  onAdd: PropTypes.func.isRequired,
  /** whether the button should be disabled */
  disabled: PropTypes.bool
};

CalendarButton.defaultProps = {
  disabled: false
};

export default CalendarButton
