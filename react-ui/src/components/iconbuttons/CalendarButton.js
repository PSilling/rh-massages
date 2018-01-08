// react imports
import React, { Component } from 'react';
import PropTypes from 'prop-types';

// util imports
import _t from '../../util/Translations';

/**
 * Custom button component that handles event addition to Google Calendar.
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
  onAdd: PropTypes.func.isRequired, // function to be called on action confirmation
  disabled: PropTypes.bool // whether the button should be disabled
};

CalendarButton.defaultProps = {
  disabled: false
};

export default CalendarButton
