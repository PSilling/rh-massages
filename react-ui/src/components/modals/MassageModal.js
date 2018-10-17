// react imports
import React, { Component } from "react";
import ReactDOM from "react-dom";
import PropTypes from "prop-types";

// module imports
import Datetime from "react-datetime";
import { ModalContainer, ModalDialog } from "react-modal-dialog";
import moment from "moment";

// component imports
import AddButton from "../iconbuttons/AddButton";
import ModalActions from "../buttons/ModalActions";

// util imports
import _t from "../../util/Translations";
import Util from "../../util/Util";

/**
 * Input Modal for Massage management. Allows the change of Massage date, duration and masseuse.
 * Based on given values can be used for both creating and editing of Massages.
 */
class MassageModal extends Component {
  state = { date: null, time: null, masseuse: "" };

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
    Util.post(
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
    Util.put(
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

  handleModalKeyPress = event => {
    if (event.charCode === 13 && document.activeElement === ReactDOM.findDOMNode(this.modalDialog)) {
      if (this.props.massage === null || this.props.massage.generated) {
        this.addMassage();
      } else {
        this.editMassage();
      }
    }
  };

  handleInputKeyPress = event => {
    if (event.key === "Enter") {
      if (this.props.massage === null || this.props.massage.generated) {
        this.addMassage();
      } else {
        this.editMassage();
      }
    }
  };

  renderInsides = () => (
    <div>
      <h2>
        {this.props.massage === null || this.props.massage.generated
          ? _t.translate("New Massage")
          : _t.translate("Edit Massage")}
      </h2>
      <hr />
      <div className="form-group col-md-12">
        <label htmlFor="masseuseInput">{_t.translate("Masseur/Masseuse")}</label>
        <input
          id="masseuseInput"
          value={this.state.masseuse}
          onChange={this.changeMasseuse}
          className="form-control"
          autoFocus
          onFocus={Util.moveCursorToEnd}
          onKeyPress={this.handleInputKeyPress}
          type="text"
          maxLength="64"
          placeholder={_t.translate("Masseur/Masseuse")}
          list="masseuses"
        />
        <datalist id="masseuses">
          {this.props.masseuses.map(item => (
            <option key={item} value={item} />
          ))}
        </datalist>
      </div>

      <div className="form-group col-md-12">
        <label htmlFor="durationInput">{_t.translate("Duration")}</label>
        <div className="row">
          <div className="col-md-3">
            <Datetime
              value={this.state.time}
              onChange={this.changeTime}
              dateFormat={false}
              inputProps={{
                id: "durationInput",
                placeholder: _t.translate("Duration"),
                onKeyPress: this.handleInputKeyPress
              }}
            />
          </div>
        </div>
      </div>

      <div className="form-group col-md-12">
        <label htmlFor="dateInput">{_t.translate("Massage time")}</label>
        <div className="row">
          <div className="col-md-4">
            <Datetime
              value={this.state.date}
              onChange={this.changeDate}
              isValidDate={current => current.isAfter(this.yesterday)}
              inputProps={{
                id: "dateInput",
                placeholder: _t.translate("Massage time"),
                onKeyPress: this.handleInputKeyPress
              }}
            />
          </div>
        </div>
      </div>
      {this.props.massage === null || this.props.massage.generated ? (
        <ModalActions
          primaryLabel={_t.translate("Add")}
          onProceed={this.addMassage}
          onClose={this.props.onToggle}
          autoFocus={false}
        />
      ) : (
        <ModalActions
          primaryLabel={_t.translate("Edit")}
          onProceed={this.editMassage}
          onClose={this.props.onToggle}
          autoFocus={false}
        />
      )}
    </div>
  );

  renderModal = () => {
    if (this.props.withPortal) {
      return (
        <ModalContainer onClose={this.props.onToggle}>
          <ModalDialog
            onClose={this.props.onToggle}
            width="50%"
            style={{ outline: "none" }}
            tabIndex="-1"
            onKeyPress={this.handleModalKeyPress}
            ref={dialog => {
              this.modalDialog = dialog;
            }}
          >
            {this.renderInsides()}
          </ModalDialog>
        </ModalContainer>
      );
    }
    return this.renderInsides();
  };

  render() {
    return (
      <span>
        <AddButton onAdd={this.props.onToggle} />

        {this.props.active && this.renderModal()}
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
