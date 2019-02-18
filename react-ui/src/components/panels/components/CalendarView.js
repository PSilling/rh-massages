// react imports
import React, { Component } from "react";
import PropTypes from "prop-types";

// module imports
import moment from "moment";
import { Table } from "reactstrap";

// component imports
import EventRow from "./EventRow";
import PrintModal from "../../modals/PrintModal";

// util imports
import _t from "../../../util/Translations";
import Util from "../../../util/Util";

class CalendarView extends Component {
  static title() {
    return "";
  }

  static navigate() {
    return new Date();
  }

  state = { printMassages: null };

  setPrintMassages = massages => {
    this.setState({ printMassages: massages });
  };

  createPrintRows = () => {
    const rows = [];
    if (this.state.printMassages.length === 0) {
      rows.push(
        <tr key="info">
          <td colSpan="4">{_t.translate("None")}</td>
        </tr>
      );
    } else {
      for (let i = 0; i < this.state.printMassages.length; i++) {
        rows.push(
          <tr key={i}>
            <td>{moment(this.state.printMassages[i].date).format("L")}</td>
            <td>
              {`${moment(this.state.printMassages[i].date).format("H:mm")}–${moment(
                this.state.printMassages[i].ending
              ).format("H:mm")}`}
            </td>
            <td>{`${this.state.printMassages[i].masseuse.name} ${this.state.printMassages[i].masseuse.surname}`}</td>
            <td>
              {Util.isEmpty(this.state.printMassages[i].client)
                ? _t.translate("Free")
                : Util.getContactInfo(this.state.printMassages[i].client)}
            </td>
          </tr>
        );
      }
    }
    return rows;
  };

  render() {
    return (
      <span>
        <div className="no-print">
          <Table hover responsive striped size="sm">
            <thead>
              <tr>
                <th scope="col">{this.props.localizer.messages.date}</th>
                <th scope="col">{this.props.localizer.messages.time}</th>
                <th scope="col">{this.props.localizer.messages.event}</th>
                <th scope="col">
                  <PrintModal events={this.props.events} onPrint={this.setPrintMassages} />
                </th>
              </tr>
            </thead>
            <tbody>
              {this.props.events.map(item => (
                <EventRow key={item.massage.id} event={item} onCancel={this.props.onCancel} />
              ))}
            </tbody>
          </Table>
        </div>

        {this.state.printMassages !== null && (
          <div className="print-only">
            <Table>
              <thead>
                <tr>
                  <th scope="col">{_t.translate("Date")}</th>
                  <th scope="col">{_t.translate("Time")}</th>
                  <th scope="col">{_t.translate("Masseur/Masseuse")}</th>
                  <th scope="col" width="40%">
                    {_t.translate("Client")}
                  </th>
                </tr>
              </thead>
              <tbody>{this.createPrintRows()}</tbody>
            </Table>
          </div>
        )}
      </span>
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
