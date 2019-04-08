// react imports
import React, { Component } from "react";
import PropTypes from "prop-types";

// module imports
import { Row, Col, Label, FormGroup, Input, Modal, ModalBody } from "reactstrap";
import Datetime from "react-datetime";
import moment from "moment";

// component imports
import ModalActions from "../buttons/ModalActions";
import TooltipIconButton from "../iconbuttons/TooltipIconButton";

// util imports
import _t from "../../util/Translations";
import Util from "../../util/Util";

/**
 * Modal dialog with printing settings.
 */
class PrintModal extends Component {
  state = {
    active: false,
    checkedRadio: 3,
    from: moment(),
    to: moment().endOf("day")
  };

  radios = ["just today", "this week", "this month", "all", "custom:"];

  printMassages = () => {
    let from;
    let to;
    let skipTimeCheck = false;

    switch (this.state.checkedRadio) {
      case 0:
        from = moment();
        to = moment().endOf("day");
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
        skipTimeCheck = true;
        break;
      case 4:
        ({ to, from } = this.state);
        break;
      default:
        Util.notify("error", "", _t.translate("An error occured!"));
    }

    const printMassages = [];

    for (let i = 0; i < this.props.events.length; i++) {
      if (skipTimeCheck || moment(this.props.events[i].massage.date).isBetween(from, to)) {
        printMassages.push(this.props.events[i].massage);
      }
    }

    this.props.onPrint(printMassages);
    setTimeout(() => window.print(), 10);
    setTimeout(() => this.props.onPrint(null), 15);
    this.toggleModal();
  };

  changeCheck = id => {
    this.setState({ checkedRadio: id });
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
    const { events, onPrint, withPortal, ...rest } = this.props;
    return (
      <div className="no-print float-right">
        <TooltipIconButton
          {...rest}
          icon="print"
          tooltip={_t.translate("Print my massage schedule")}
          onClick={this.toggleModal}
        />

        {this.state.active && this.createModal()}
      </div>
    );
  }
}

PrintModal.propTypes = {
  /** massage events available for printing */
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
  /** function called on print action */
  onPrint: PropTypes.func.isRequired,
  /** whether ModalContainer should be used; useful for testing to avoid portals */
  withPortal: PropTypes.bool
};

PrintModal.defaultProps = {
  withPortal: true
};

export default PrintModal;
