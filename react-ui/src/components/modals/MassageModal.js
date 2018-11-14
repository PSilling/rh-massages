// react imports
import React, { Component } from "react";
import PropTypes from "prop-types";

// module imports
import { Row, Col, Modal, ModalBody } from "reactstrap";
import moment from "moment";

// component imports
import LabeledDatetime from "../formitems/LabeledDatetime";
import LabeledInput from "../formitems/LabeledInput";
import ModalActions from "../buttons/ModalActions";
import TooltipIconButton from "../iconbuttons/TooltipIconButton";

// util imports
import _t from "../../util/Translations";
import Fetch from "../../util/Fetch";
import Util from "../../util/Util";

/**
 * Input Modal for Massage management. Allows the change of Massage date, duration and masseuse.
 * Based on given values can be used for both creating and editing of Massages.
 */
class MassageModal extends Component {
  state = { date: moment().add(1, "hours"), time: moment("00:30", "HH:mm"), masseuse: "" };

  yesterday = moment().subtract(1, "day");

  componentWillReceiveProps(nextProps) {
    if (this.props === nextProps) return;

    this.setState({
      date: nextProps.massage === null ? moment().add(1, "hours") : moment(nextProps.massage.date),
      time:
        nextProps.massage === null
          ? moment("00:30", "HH:mm")
          : moment.utc(moment(nextProps.massage.ending).diff(moment(nextProps.massage.date))),
      masseuse: nextProps.massage === null ? "" : nextProps.massage.masseuse
    });
  }

  changeMasseuse = event => {
    this.setState({ masseuse: event.target.value });
  };

  changeDate = date => {
    if (typeof date === "string") {
      return;
    }
    this.setState({ date: date.isBefore(moment().startOf("minute")) ? moment() : date });
  };

  changeTime = time => {
    if (typeof time === "string") {
      return;
    }
    this.setState({ time });
  };

  getStartingDate = () => {
    const minDate = moment().startOf("minute");
    if (this.state.date.isBefore(minDate)) {
      this.setState({ date: minDate });
      return minDate;
    }
    return moment(this.state.date);
  };

  addMassage = () => {
    if (Util.isEmpty(this.state.masseuse)) {
      Util.notify("error", "", _t.translate("Masseuse is required!"));
      return;
    }
    const date = this.getStartingDate();
    Fetch.post(
      Util.MASSAGES_URL,
      [
        {
          date: date.toDate(),
          ending: date
            .add(this.state.time.get("hour"), "hours")
            .add(this.state.time.get("minute"), "minutes")
            .toDate(),
          masseuse: this.state.masseuse,
          client: null,
          facility: { id: this.props.facilityId }
        }
      ],
      () => {
        this.props.onToggle();
        this.props.getCallback();
      }
    );
  };

  editMassage = () => {
    if (Util.isEmpty(this.state.masseuse)) {
      Util.notify("error", "", _t.translate("Masseuse is required!"));
      return;
    }
    const date = this.getStartingDate();
    Fetch.put(
      Util.MASSAGES_URL,
      [
        {
          id: this.props.massage.id,
          date: date.toDate(),
          ending: date
            .add(this.state.time.get("hour"), "hours")
            .add(this.state.time.get("minute"), "minutes")
            .toDate(),
          masseuse: this.state.masseuse,
          client: this.props.massage.client,
          facility: this.props.massage.facility
        }
      ],
      () => {
        this.props.onToggle();
        this.props.getCallback();
      }
    );
  };

  handleKeyPress = event => {
    if (event.key === "Enter" && document.activeElement.tabIndex === -1) {
      if (this.props.massage === null || this.props.massage.generated) {
        this.addMassage();
      } else {
        this.editMassage();
      }
    }
  };

  handleEnterPress = () => {
    if (this.props.massage === null || this.props.massage.generated) {
      this.addMassage();
    } else {
      this.editMassage();
    }
  };

  createInsides = () => (
    <ModalBody>
      <Row>
        <Col md="12">
          <h3>
            {this.props.massage === null || this.props.massage.generated
              ? _t.translate("New Massage")
              : _t.translate("Edit Massage")}
          </h3>
          <hr />
        </Col>
      </Row>

      <Row>
        <LabeledInput
          label={_t.translate("Masseur/Masseuse")}
          value={this.state.masseuse}
          onChange={this.changeMasseuse}
          onEnterPress={this.handleEnterPress}
          tooltip={_t.translate("The name of the masseur or massuese providing this massage")}
          type="text"
          maxLength="64"
          options={this.props.masseuses}
        />
      </Row>

      <Row>
        <LabeledDatetime
          size="3"
          label={_t.translate("Duration")}
          value={this.state.time}
          onChange={this.changeTime}
          onEnterPress={this.handleEnterPress}
          tooltip={_t.translate("How long should the massage be")}
          dateFormat={false}
        />
      </Row>

      <Row>
        <LabeledDatetime
          size="4"
          label={_t.translate("Massage time")}
          value={this.state.date}
          onChange={this.changeDate}
          onEnterPress={this.handleEnterPress}
          tooltip={_t.translate("When should the massage be provided")}
          isValidDate={current => current.isAfter(this.yesterday)}
        />
      </Row>

      {this.props.massage === null || this.props.massage.generated ? (
        <ModalActions primaryLabel={_t.translate("Add")} onProceed={this.addMassage} onClose={this.props.onToggle} />
      ) : (
        <ModalActions primaryLabel={_t.translate("Edit")} onProceed={this.editMassage} onClose={this.props.onToggle} />
      )}
    </ModalBody>
  );

  createModal = () =>
    this.props.withPortal ? (
      <Modal size="lg" isOpen toggle={this.props.onToggle} tabIndex="-1" onKeyPress={this.handleKeyPress}>
        {this.createInsides()}
      </Modal>
    ) : (
      this.createInsides()
    );

  render() {
    return (
      <span>
        <TooltipIconButton
          icon="plus"
          onClick={this.props.onToggle}
          tooltip={_t.translate("Create a new massage")}
          size="md"
          style={{}}
        />

        {this.props.active && this.createModal()}
      </span>
    );
  }
}

MassageModal.propTypes = {
  /** whether the dialog should be shown */
  active: PropTypes.bool.isRequired,
  /** callback function for Massage list update */
  getCallback: PropTypes.func.isRequired,
  /** function called on modal toggle */
  onToggle: PropTypes.func.isRequired,
  /** ID of the selected Facility */
  facilityId: PropTypes.number,
  /** Massage to be possibly edited or null when adding */
  massage: PropTypes.shape({
    id: PropTypes.number,
    masseuse: PropTypes.string,
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
    }),
    generated: PropTypes.bool
  }),
  /** unique Massage masseuses of the given Facility */
  masseuses: PropTypes.arrayOf(PropTypes.string),
  /** whether ModalContainer should be used; useful for testing to avoid portals */
  withPortal: PropTypes.bool
};

MassageModal.defaultProps = {
  facilityId: null,
  massage: null,
  masseuses: null,
  withPortal: true
};

export default MassageModal;
