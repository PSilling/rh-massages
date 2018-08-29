// react imports
import React, { Component } from 'react';
import PropTypes from 'prop-types';

// util imports
import _t from '../../util/Translations';

/**
 * Navigation toolbar for event calendar.
 */
class CalendarToolbar extends Component {

  render() {
    return (
      <div>
        <div className="row">
          <div className="col-md-1">
            <button type="button" className="btn btn-default" title={ _t.translate("Previous") }
              onClick={this.props.leftAction} disabled={this.props.leftDisabled}>
              <span className="glyphicon glyphicon-chevron-left"></span>
            </button>
          </div>

          <div className="col-md-10 text-center">
            <div className="btn-group">
              <button type="button" className={"btn btn-default" + (!this.props.monthActive ? " active" : "")}
                onClick={() => this.props.onViewChange("work_week")}>
                { _t.translate('Week') }
              </button>

              <button type="button" className={"btn btn-default" + (this.props.monthActive ? " active" : "")}
                onClick={() => this.props.onViewChange("month")}>
                { _t.translate('Month') }
              </button>
            </div>
          </div>

          <div className="col-md-1 text-right">
            <button type="button" className="btn btn-default" title={ _t.translate("Next") }
              onClick={this.props.rightAction} disabled={this.props.rightDisabled}>
              <span className="glyphicon glyphicon-chevron-right"></span>
            </button>
          </div>

        </div>
        <div className="text-center" style={{'marginBottom': '5px', marginTop: '5px'}}>
          <strong>
            {this.props.month}
          </strong>
        </div>
      </div>
    );
  }
}

CalendarToolbar.propTypes = {
  /** current selected month */
  month: PropTypes.string,
  /** whether month is the currently selected view */
  monthActive: PropTypes.bool.isRequired,
  /** whether the left chevron button should be disabled */
  leftDisabled: PropTypes.bool.isRequired,
  /** whether the right chevron button should be disabled */
  rightDisabled: PropTypes.bool.isRequired,
  /** function called on left chevron button click */
  leftAction: PropTypes.func.isRequired,
  /** function called on right chevron button click */
  rightAction: PropTypes.func.isRequired,
  /** function called on view change */
  onViewChange: PropTypes.func.isRequired
};

export default CalendarToolbar
