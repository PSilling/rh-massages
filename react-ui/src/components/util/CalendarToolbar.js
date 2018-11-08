// react imports
import React, { Component } from "react";
import PropTypes from "prop-types";

// module imports
import { ButtonGroup, Button, Row, Col } from "reactstrap";
import moment from "moment";

// component imports
import TooltipIconButton from "../iconbuttons/TooltipIconButton";
import TooltipGroup from "./TooltipGroup";

// util imports
import _t from "../../util/Translations";
import Util from "../../util/Util";

/**
 * Navigation toolbar for event calendar.
 */
class CalendarToolbar extends Component {
  tooltipTargets = Util.getTooltipTargets(2);

  tooltipLabels = [_t.translate("View per week"), _t.translate("View per month")];

  render() {
    return (
      <div>
        <Row>
          <Col md="12" className="text-center">
            <strong>{this.props.month}</strong>
          </Col>
        </Row>
        <Row className="mb-3">
          <Col md="1">
            <TooltipIconButton
              icon="chevron-circle-left"
              onClick={this.props.leftAction}
              tooltip={`${_t.translate("Previous")} ${
                this.props.monthActive ? _t.translate("Month").toLowerCase() : _t.translate("Week").toLowerCase()
              }`}
              disabled={this.props.leftDisabled}
              size="md"
            />
          </Col>
          <Col md="10" className="text-center">
            <ButtonGroup>
              <Button
                id={this.tooltipTargets[0]}
                className="ml-2"
                active={!this.props.monthActive}
                onClick={() => this.props.onViewChange("work_week")}
                outline
              >
                {_t.translate("Week")}
              </Button>
              <Button
                id={this.tooltipTargets[1]}
                active={this.props.monthActive}
                onClick={() => this.props.onViewChange("month")}
                outline
              >
                {_t.translate("Month")}
              </Button>
            </ButtonGroup>
            <TooltipGroup targets={this.tooltipTargets} labels={this.tooltipLabels} />
          </Col>
          <Col md="1" className="text-right">
            <TooltipIconButton
              icon="chevron-circle-right"
              onClick={this.props.rightAction}
              tooltip={`${_t.translate("Next")} ${
                this.props.monthActive ? _t.translate("Month").toLowerCase() : _t.translate("Week").toLowerCase()
              }`}
              disabled={this.props.rightDisabled}
              size="md"
            />
          </Col>
        </Row>
      </div>
    );
  }
}

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
