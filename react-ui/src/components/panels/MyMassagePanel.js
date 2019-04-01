// react imports
import React, { Component } from "react";
import PropTypes from "prop-types";

// module imports
import { Row, Col } from "reactstrap";
import moment from "moment";
import BigCalendar from "react-big-calendar";

// component imports
import CalendarView from "./components/CalendarView";

// util imports
import _t from "../../util/Translations";

const localizer = BigCalendar.momentLocalizer(moment);
/**
 * Calendar with my massage events inside an agenda view.
 */
class MyMassagePanel extends Component {
  localization = {
    allDay: _t.translate("All day"),
    date: _t.translate("Date"),
    facility: _t.translate("Facility"),
    time: _t.translate("Time"),
    event: _t.translate("Event")
  };

  generateTitle = event =>
    `${_t.translate("Massage")}: ${event.massage.masseuse.name} ${event.massage.masseuse.surname}`;

  render() {
    return (
      <div className="mb-3">
        <Row>
          <Col md="12">
            <BigCalendar
              messages={this.localization}
              events={this.props.events}
              defaultDate={new Date()}
              length={365}
              defaultView="view"
              views={{ view: CalendarView }}
              style={{ height: "85vh" }}
              onCancel={this.props.onCancel}
              slotPropGetter={this.eventStyler}
              titleAccessor={this.generateTitle}
              startAccessor={event => new Date(event.massage.date)}
              endAccessor={event => new Date(event.massage.ending)}
              localizer={localizer}
              toolbar={false}
            />
          </Col>
        </Row>
      </div>
    );
  }
}

MyMassagePanel.propTypes = {
  /** events featured in the calendar */
  events: PropTypes.arrayOf(
    PropTypes.shape({
      bgColor: PropTypes.string,
      massage: PropTypes.shape({
        id: PropTypes.number,
        masseuse: PropTypes.shape({
          email: PropTypes.string,
          masseur: PropTypes.bool,
          name: PropTypes.string,
          sub: PropTypes.string,
          subscribed: PropTypes.bool,
          surname: PropTypes.string
        }),
        date: PropTypes.oneOfType([PropTypes.number, PropTypes.instanceOf(Date)]),
        ending: PropTypes.oneOfType([PropTypes.number, PropTypes.instanceOf(Date)]),
        client: PropTypes.shape({
          email: PropTypes.string,
          name: PropTypes.string,
          surname: PropTypes.string,
          sub: PropTypes.string,
          subscribed: PropTypes.bool
        }),
        facility: PropTypes.shape({
          id: PropTypes.number,
          name: PropTypes.string
        })
      })
    })
  ).isRequired,
  /** function called on massage cancellation */
  onCancel: PropTypes.func.isRequired
};

export default MyMassagePanel;
