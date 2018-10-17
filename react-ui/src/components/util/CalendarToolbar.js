// react imports
import React from "react";
import PropTypes from "prop-types";

// module imports
import moment from "moment";

// util imports
import _t from "../../util/Translations";

/**
 * Navigation toolbar for event calendar.
 */
const CalendarToolbar = function CalendarToolbar(props) {
  return (
    <div>
      <div className="row">
        <div className="col-md-1">
          <button
            type="button"
            className="btn btn-default"
            title={_t.translate("Previous")}
            onClick={props.leftAction}
            disabled={props.leftDisabled}
          >
            <span className="glyphicon glyphicon-chevron-left" />
          </button>
        </div>

        <div className="col-md-10 text-center">
          <div className="btn-group">
            <button
              type="button"
              className={`btn btn-default${!props.monthActive ? " active" : ""}`}
              onClick={() => props.onViewChange("work_week")}
            >
              {_t.translate("Week")}
            </button>

            <button
              type="button"
              className={`btn btn-default${props.monthActive ? " active" : ""}`}
              onClick={() => props.onViewChange("month")}
            >
              {_t.translate("Month")}
            </button>
          </div>
        </div>

        <div className="col-md-1 text-right">
          <button
            type="button"
            className="btn btn-default"
            title={_t.translate("Next")}
            onClick={props.rightAction}
            disabled={props.rightDisabled}
          >
            <span className="glyphicon glyphicon-chevron-right" />
          </button>
        </div>
      </div>
      <div className="text-center" style={{ marginBottom: "5px", marginTop: "5px" }}>
        <strong>{props.month}</strong>
      </div>
    </div>
  );
};

CalendarToolbar.propTypes = {
  /** function called on left chevron button click */
  leftAction: PropTypes.func.isRequired,
  /** whether the left chevron button should be disabled */
  leftDisabled: PropTypes.bool.isRequired,
  /** whether month is the currently selected view */
  monthActive: PropTypes.bool.isRequired,
  /** function called on view change */
  onViewChange: PropTypes.func.isRequired,
  /** function called on right chevron button click */
  rightAction: PropTypes.func.isRequired,
  /** whether the right chevron button should be disabled */
  rightDisabled: PropTypes.bool.isRequired,
  /** current selected montmoment(this.state.date).format("MMMM YYYY")h */
  month: PropTypes.string
};

CalendarToolbar.defaultProps = {
  month: moment().format("MMMM YYYY")
};

export default CalendarToolbar;
