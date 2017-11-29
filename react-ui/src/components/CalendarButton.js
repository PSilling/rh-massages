// react imports
import React, { Component } from 'react';

/**
 * Custom button component that handles event addition to Google Calendar.
 */
class CalendarButton extends Component {

  render() {
    return(
      <span>
        <button disabled={this.props.disabled} style={{ 'color': '#000' }}  type="button"
          className="btn btn-link" onClick={this.props.onAdd}>
          <span className="glyphicon glyphicon-calendar"></span>
        </button>
      </span>
    );
  }
}

export default CalendarButton
