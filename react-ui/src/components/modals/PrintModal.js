// react imports
import React, { Component } from "react";
import PropTypes from "prop-types";

// module imports
import { Row, Col, Label, FormGroup, Input, Modal, ModalBody } from "reactstrap";
import Datetime from "react-datetime";
import moment from "moment";

// component imports
import LabeledInput from "../formitems/LabeledInput";
import ModalActions from "../buttons/ModalActions";
import TooltipButton from "../buttons/TooltipButton";

// util imports
import _t from "../../util/Translations";
import Fetch from "../../util/Fetch";
import Util from "../../util/Util";

/**
 * Modal dialog with printing settings.
 */
class PrintModal extends Component {
  state = {
    active: false,
    checkedRadio: 0,
    filter: "",
    from: moment(),
    to: moment().add(1, "day")
  };

  radios = ["just today", "this week", "this month", "chosen month", "custom:"];

  printMassages = () => {
    let from;
    let to;
    switch (this.state.checkedRadio) {
      case 0:
        from = moment();
        to = moment();
        break;
      case 1:
        from = moment().startOf("isoWeek");
        to = moment().endOf("isoWeek");
        break;
      case 2:
        from = moment().startOf("month");
        to = moment().endOf("month");
        break;
      case 3:
        from = this.props.date.clone().startOf("month");
        to = this.props.date.endOf("month");
        break;
      case 4:
        ({ to, from } = this.state);
        break;
      default:
        Util.notify("error", "", _t.translate("An error occured!"));
    }

    Fetch.get(
      `${Util.FACILITIES_URL + this.props.facilityId}/massages?search=${this.state.filter}&from=${moment(from).unix() *
        1000}&to=${moment(to).unix() * 1000}`,
      json => {
        if (json !== undefined && json.length !== 0) {
          this.props.onPrint(json.massages);
          setTimeout(() => window.print(), 5);
          setTimeout(() => this.props.onPrint(null), 10);
        }
        this.toggleModal();
      }
    );
  };

  changeCheck = id => {
    this.setState({ checkedRadio: id });
  };

  changeFilter = event => {
    this.setState({ filter: event.target.value });
  };

  changeFrom = date => {
    if (typeof date === "string" || date.isAfter(this.state.to)) {
      return;
    }
    this.setState({ from: date });
  };

  changeTo = date => {
    if (typeof date === "string" || date.isBefore(this.state.from)) {
      return;
    }
    this.setState({ to: date });
  };

  handleKeyPress = event => {
    if (event.key === "Enter" && document.activeElement.tabIndex === -1) {
      this.printMassages();
    }
  };

  toggleModal = () => {
    this.setState(prevState => ({ active: !prevState.active }));
  };

  createInsides = () => (
    <ModalBody>
      <Row>
        <Col md="12">
          <h3>{_t.translate("Print settings")}</h3>
          <hr />
        </Col>
      </Row>

      <Row>
        <Col md="12">
          <Label>{_t.translate("Time range")}</Label>
        </Col>
      </Row>

      <Row>
        <Col md="12">
          <FormGroup check inline>
            <span>
              {this.radios.map((item, index) => (
                <Label key={index} for={item}>
                  <Input
                    id={item}
                    type="radio"
                    onChange={() => this.changeCheck(index)}
                    onKeyPress={this.handleInputKeyPress}
                    checked={this.state.checkedRadio === index}
                  />
                  <Label className="mr-2" for={item}>
                    {_t.translate(item)}
                  </Label>
                </Label>
              ))}
            </span>
          </FormGroup>
        </Col>
      </Row>

      <Row className="mb-3">
        <Col md="3">
          <Datetime
            id="fromInput"
            value={this.state.from}
            inputProps={{ disabled: this.state.checkedRadio !== 4 }}
            onChange={this.changeFrom}
            timeFormat={false}
          />
        </Col>
        <Col md="1" className="text-center mt-2">
          <strong>–</strong>
        </Col>
        <Col md="3">
          <Datetime
            id="toInput"
            value={this.state.to}
            inputProps={{ disabled: this.state.checkedRadio !== 4 }}
            onChange={this.changeTo}
            timeFormat={false}
          />
        </Col>
      </Row>

      <Row>
        <LabeledInput
          size="8"
          label={_t.translate("Filtering")}
          value={this.state.filter}
          onChange={this.changeFilter}
          onEnterPress={this.printMassages}
          tooltip={_t.translate("Masseuse, masseur or client name to use as a massages filter")}
          type="text"
          maxLength="128"
          options={this.props.masseuses}
        />
      </Row>

      <ModalActions primaryLabel={_t.translate("Print")} onProceed={this.printMassages} onClose={this.toggleModal} />
    </ModalBody>
  );

  createModal = () =>
    this.props.withPortal ? (
      <Modal size="lg" isOpen toggle={this.toggleModal} tabIndex="-1" onKeyPress={this.handleKeyPress}>
        {this.createInsides()}
      </Modal>
    ) : (
      this.createInsides()
    );

  render() {
    const { date, facilityId, onPrint, masseuses, withPortal, ...rest } = this.props;
    return (
      <span>
        <TooltipButton
          {...rest}
          label={_t.translate("Print")}
          tooltip={_t.translate("Show massage schedule print options")}
          onClick={this.toggleModal}
        />

        {this.state.active && this.createModal()}
      </span>
    );
  }
}

PrintModal.propTypes = {
  /** current date selected in the calendar */
  date: PropTypes.instanceOf(moment).isRequired,
  /** ID of the selected Facility */
  facilityId: PropTypes.number.isRequired,
  /** function called on print action */
  onPrint: PropTypes.func.isRequired,
  /** unique Massage masseuses of the given Facility */
  masseuses: PropTypes.arrayOf(PropTypes.string),
  /** whether ModalContainer should be used; useful for testing to avoid portals */
  withPortal: PropTypes.bool
};

PrintModal.defaultProps = {
  masseuses: null,
  withPortal: true
};

export default PrintModal;
