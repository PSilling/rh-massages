// react imports
import React from "react";
import PropTypes from "prop-types";

// util imports
import _t from "../../util/Translations";

/**
 * Icon only button that handles event addition to Google Calendar.
 */
const CalendarButton = function CalendarButton(props) {
  return (
    <span>
      {props.disabled ? (
        <button
          disabled
          style={{ color: "#000" }}
          type="button"
          className="btn btn-link"
          title={_t.translate("Add to Google Calendar")}
        >
          <span className="glyphicon glyphicon-calendar" />
        </button>
      ) : (
        <a href={props.link} target="_blank" rel="noopener noreferrer" tabIndex="-1">
          <button
            style={{ color: "#000" }}
            type="button"
            className="btn btn-link"
            title={_t.translate("Add to Google Calendar")}
          >
            <span className="glyphicon glyphicon-calendar" />
          </button>
        </a>
      )}
    </span>
  );
};

CalendarButton.propTypes = {
  /** whether the button should be disabled */
  disabled: PropTypes.bool,
  /** calendar link to redirect to */
  link: PropTypes.string
};

CalendarButton.defaultProps = {
  disabled: false,
  link: ""
};

export default CalendarButton;
