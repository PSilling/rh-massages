// react imports
import React, { Component } from "react";
import PropTypes from "prop-types";

// module imports
import { Table } from "reactstrap";

// component imports
import EventRow from "./EventRow";

class CalendarView extends Component {
  static title() {
    return "";
  }

  static navigate() {
    return new Date();
  }

  render() {
    return (
      <Table hover responsive striped size="sm">
        <thead>
          <tr>
            <th>{this.props.localizer.messages.date}</th>
            <th>{this.props.localizer.messages.time}</th>
            <th>{this.props.localizer.messages.event}</th>
          </tr>
        </thead>
        <tbody>
          {this.props.events.map(item => (
            <EventRow key={item.massage.id} event={item} onCancel={this.props.onCancel} />
          ))}
        </tbody>
      </Table>
    );
  }
}

CalendarView.propTypes = {
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
  /** defined localizer translation strings */
  localizer: PropTypes.shape({
    messages: PropTypes.shape({
      date: PropTypes.string,
      time: PropTypes.string,
      event: PropTypes.string
    })
  }).isRequired,
  /** function called on massage cancellation */
  onCancel: PropTypes.func.isRequired
};

export default CalendarView;
