// react imports
import React, { Component } from "react";
import PropTypes from "prop-types";

// module imports
import { Row, Col, FormGroup, Input, Label, Modal, ModalBody } from "reactstrap";
import moment from "moment";

// component imports
import LabeledDatetime from "../formitems/LabeledDatetime";
import ModalActions from "../buttons/ModalActions";
import TooltipButton from "../buttons/TooltipButton";

// util imports
import _t from "../../util/Translations";
import Auth from "../../util/Auth";
import Fetch from "../../util/Fetch";
import Util from "../../util/Util";

/**
 * Input Modal for Massage management. Allows the change of Massage date, duration and masseuse.
 * Based on given values can be used for both creating and editing of Massages.
 */
class MassageModal extends Component {
  state = {
    date: moment().add(1, "hours"),
    time: moment("00:30", "H:mm"),
    masseuse: { sub: "", name: "", surname: "", email: "", subscribed: false, masseur: true }
  };

  yesterday = moment().subtract(1, "day");

  componentDidMount() {
    this.setState({ masseuse: this.getMasseuse() });
  }

  componentWillReceiveProps(nextProps) {
    if (this.props === nextProps) return;

    this.setState({
      date: nextProps.massage === null ? moment().add(1, "hours") : moment(nextProps.massage.date),
      time:
        nextProps.massage === null
          ? moment("00:30", "HH:mm")
          : moment.utc(moment(nextProps.massage.ending).diff(moment(nextProps.massage.date))),
      masseuse: nextProps.massage === null ? this.getMasseuse() : nextProps.massage.masseuse
    });
  }

  getMasseuse = () => {
    if (this.props.masseuses.length === 0) {
      return { sub: "", name: "", surname: "", email: "", subscribed: false, masseur: true };
    }

    if (!Auth.isAdmin()) {
      return Auth.getClient();
    }

    return this.props.masseuses[0];
  };

  changeMasseuse = event => {
    this.setState({
      masseuse: this.props.masseuses[this.props.masseuseNames.indexOf(event.target.value)]
    });
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
              ? _t.translate("New massage")
              : _t.translate("Edit massage")}
          </h3>
          <hr />
        </Col>
      </Row>

      {Auth.isAdmin() && (
        <Row>
          <Col md="4">
            <FormGroup>
              <Label for="masseuseNameSelect">{_t.translate("Masseur/Masseuse")}</Label>
              <Input
                id="masseuseNameSelect"
                type="select"
                value={`${this.state.masseuse.name} ${this.state.masseuse.surname}`}
                onChange={this.changeMasseuse}
              >
                {this.props.masseuseNames.map(item => (
                  <option key={item}>{item}</option>
                ))}
              </Input>
            </FormGroup>
          </Col>
        </Row>
      )}

      <Row>
        <LabeledDatetime
          size="3"
          label={_t.translate("Duration")}
          value={this.state.time}
          onChange={this.changeTime}
          onEnterPress={this.handleEnterPress}
          timeFormat="H:mm"
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
        <TooltipButton
          onClick={this.props.onToggle}
          label={_t.translate("New massage")}
          tooltip={_t.translate("Create a new massage")}
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
    }),
    generated: PropTypes.bool
  }),
  /** names of Massage masseuses in the portal */
  masseuseNames: PropTypes.arrayOf(PropTypes.string),
  /** Massage masseuses in the portal */
  masseuses: PropTypes.arrayOf(
    PropTypes.shape({
      email: PropTypes.string,
      masseur: PropTypes.bool,
      name: PropTypes.string,
      sub: PropTypes.string,
      subscribed: PropTypes.bool,
      surname: PropTypes.string
    })
  ),
  /** whether ModalContainer should be used; useful for testing to avoid portals */
  withPortal: PropTypes.bool
};

MassageModal.defaultProps = {
  facilityId: null,
  massage: null,
  masseuseNames: [],
  masseuses: [],
  withPortal: true
};

export default MassageModal;
