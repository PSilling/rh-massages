// react imports
import React, { Component } from "react";
import PropTypes from "prop-types";

// module imports
import moment from "moment";

// component imports
import MassageEventModal from "../../modals/MassageEventModal";

// util imports
import _t from "../../../util/Translations";
import Auth from "../../../util/Auth";
import Util from "../../../util/Util";

/**
 * Custom component event for MyMassages agenda calendar view.
 */
class EventRow extends Component {
  state = { active: false };

  handleToggle = () => {
    this.setState(prevState => ({ active: !prevState.active }));
  };

  handleKeyPress = event => {
    if (event.key === "Enter") {
      this.handleToggle();
    }
  };

  getUserInfo = () => {
    if (Auth.isMasseur()) {
      if (this.props.event.massage.client === null) {
        return <span style={{ color: Util.SUCCESS_COLOR }}>{_t.translate("Free")}</span>;
      }
      return (
        <span style={{ color: Util.ERROR_COLOR }}>
          {`${this.props.event.massage.client.name} ${this.props.event.massage.client.surname}`}
        </span>
      );
    }

    return <span>{`${this.props.event.massage.masseuse.name} ${this.props.event.massage.masseuse.surname}`}</span>;
  };

  render() {
    const dateString = moment(this.props.event.massage.date).format("L");
    return (
      <tr>
        <td>{this.props.event.massage.facility.name}</td>
        <td>{dateString.substring(0, dateString.length - 5)}</td>
        <td>
          {`${moment(this.props.event.massage.date).format("LT")} – ${moment(this.props.event.massage.ending).format(
            "LT"
          )}`}
        </td>
        <td colSpan="2">
          <strong
            onClick={this.handleToggle}
            role="button"
            style={{ cursor: "pointer" }}
            tabIndex="-1"
            onKeyPress={this.handleKeyPress}
          >
            {`${_t.translate("Massage")}: `}
            {this.getUserInfo()}
          </strong>
          <br />

          {this.state.active && (
            <MassageEventModal
              event={this.props.event}
              label={Auth.isMasseur() ? _t.translate("Force cancel") : _t.translate("Unassign me")}
              allowEditation={false}
              allowDeletion={false}
              onClose={this.handleToggle}
              onConfirm={() => {
                this.handleToggle();
                this.props.onCancel(this.props.event.massage);
              }}
            />
          )}
        </td>
      </tr>
    );
  }
}

EventRow.propTypes = {
  /** event to be rendered */
  event: PropTypes.shape({
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
  }).isRequired,
  /** function called on massage cancellation */
  onCancel: PropTypes.func.isRequired
};

export default EventRow;
