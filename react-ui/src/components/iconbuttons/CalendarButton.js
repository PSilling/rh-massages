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
        {this.props.disabled ?
          <button disabled style={{ 'color': '#000' }}  type="button"
            className="btn btn-link" title={ _t.translate("Add to Google Calendar") }>
            <span className="glyphicon glyphicon-calendar"></span>
          </button> :
          <a href={this.props.link} target="_blank" tabIndex="-1">
            <button style={{ 'color': '#000' }}  type="button"
              className="btn btn-link" title={ _t.translate("Add to Google Calendar") }>
              <span className="glyphicon glyphicon-calendar"></span>
            </button>
          </a>
        }
      </span>
    );
  }
}

CalendarButton.propTypes = {
  /** calendar link to redirect to */
  link: PropTypes.string,
  /** whether the button should be disabled */
  disabled: PropTypes.bool
};

CalendarButton.defaultProps = {
  link: "",
  disabled: false
};

export default CalendarButton
