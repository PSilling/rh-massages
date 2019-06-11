// react imports
import React from "react";
import PropTypes from "prop-types";

// module imports
import { ButtonGroup, Button, Row, Col } from "reactstrap";
import moment from "moment";

// component imports
import TooltipIconButton from "../iconbuttons/TooltipIconButton";

// util imports
import _t from "../../util/Translations";

/**
 * Navigation toolbar for event calendar.
 */
const CalendarToolbar = function CalendarToolbar(props) {
  return (
    <div>
      <Row>
        <Col md="12" className="text-center">
          <strong>{props.month}</strong>
        </Col>
      </Row>
      <Row className="mb-3">
        <Col md="1">
          <TooltipIconButton
            icon="chevron-circle-left"
            onClick={props.leftAction}
            disabled={props.leftDisabled}
            size="md"
          />
        </Col>
        <Col md="10" className="text-center">
          <ButtonGroup>
            <Button
              className="ml-2"
              active={!props.monthActive}
              onClick={() => props.onViewChange("work_week")}
              outline
            >
              {_t.translate("Week")}
            </Button>
            <Button active={props.monthActive} onClick={() => props.onViewChange("month")} outline>
              {_t.translate("Month")}
            </Button>
          </ButtonGroup>
        </Col>
        <Col md="1" className="text-right">
          <TooltipIconButton
            icon="chevron-circle-right"
            onClick={props.rightAction}
            disabled={props.rightDisabled}
            size="md"
          />
        </Col>
      </Row>
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
