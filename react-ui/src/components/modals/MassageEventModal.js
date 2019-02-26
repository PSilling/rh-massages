// react imports
import React, { Component } from "react";
import PropTypes from "prop-types";

// module imports
import { Row, Col, Button, Modal, ModalBody, Tooltip } from "reactstrap";
import moment from "moment";

// component imports
import ConfirmationIconButton from "../iconbuttons/ConfirmationIconButton";
import ModalActions from "../buttons/ModalActions";
import TooltipIconButton from "../iconbuttons/TooltipIconButton";

// util imports
import Auth from "../../util/Auth";
import _t from "../../util/Translations";
import Util from "../../util/Util";

/**
 * Modal displaying details about a given Massage event.
 * Also supports assignment management.
 */
class MassageEventModal extends Component {
  state = { tooltipActive: false };

  tooltipTarget = Util.getTooltipTargets(1)[0];

  definitionClass = "mb-3";

  onCalendarConfirm = () => {
    window.open(Util.getEventLink(this.props.event.massage), "_blank");
    this.props.onConfirm();
  };

  toggleTooltip = () => {
    this.setState(prevState => ({ tooltipActive: !prevState.tooltipActive }));
  };

  handleKeyPress = event => {
    if (event.key === "Enter" && document.activeElement.tabIndex === -1) {
      this.props.onClose();
    }
  };

  createChildrenButton = () => {
    let onConfirm;
    let label;
    let tooltip;

    if (Auth.isMasseur() && this.props.event.massage.client === null) {
      return null;
    }

    if (this.props.label === _t.translate("Assign me")) {
      onConfirm = this.onCalendarConfirm;
      label = _t.translate("Assign and add to calendar");
      tooltip = this.props.disabled
        ? _t.translate("Maximal simultaneous massage time per user would be exceeded")
        : _t.translate("Assigns this massage and opens a predefined Google event editor in a new tab");
    } else if (this.props.label === _t.translate("Unassign me")) {
      onConfirm = () => {
        window.open(Util.getEventLink(this.props.event.massage), "_blank");
        this.props.onClose();
      };
      label = _t.translate("Add to Google Calendar");
      tooltip = _t.translate("Opens a predefined Google event editor in a new tab");
    }

    if (label === undefined) {
      return null;
    }
    return (
      <span>
        <Button
          id={this.tooltipTarget}
          className="mr-2"
          tag="a"
          color="primary"
          disabled={this.props.disabled}
          onClick={onConfirm}
          target="_blank"
          rel="noopener noreferrer"
          tabIndex="-1"
        >
          {label}
        </Button>
        <Tooltip
          isOpen={this.state.tooltipActive}
          target={this.tooltipTarget}
          toggle={this.toggleTooltip}
          trigger="hover"
        >
          {tooltip}
        </Tooltip>
      </span>
    );
  };

  createInsides = () => (
    <ModalBody>
      <Row>
        <Col md="12">
          <h3>
            {_t.translate("Details")}
            {(Auth.isAdmin() || (Auth.isMasseur() && Auth.getSub() === this.props.event.massage.masseuse.sub)) && (
              <div className="float-right">
                {this.props.allowEditation && (
                  <TooltipIconButton icon="edit" onClick={this.props.onEdit} tooltip={_t.translate("Edit")} />
                )}
                {this.props.allowDeletion && (
                  <ConfirmationIconButton
                    className="ml-2"
                    icon="trash"
                    onConfirm={this.props.onDelete}
                    tooltip={_t.translate("Delete")}
                  />
                )}
              </div>
            )}
          </h3>
          <hr />
        </Col>
      </Row>

      <Row>
        <Col md="4">
          <dl>
            <dt>{_t.translate("Facility")}</dt>
            <dd className={this.definitionClass}>{this.props.event.massage.facility.name}</dd>
            <dt>{_t.translate("Time")}</dt>
            <dd className={this.definitionClass}>
              {`${moment(this.props.event.massage.date).format("LT")} – ${moment(
                this.props.event.massage.ending
              ).format("LT")}`}
            </dd>
            <dt>{_t.translate("Client")}</dt>
            {Util.isEmpty(this.props.event.massage.client) ? (
              <dd className={this.definitionClass}>
                <p style={{ color: Util.SUCCESS_COLOR }}>
                  <strong>{_t.translate("Free")}</strong>
                </p>
              </dd>
            ) : (
              <dd className={this.definitionClass}>
                <p
                  style={{
                    color:
                      !this.props.allowDeletion ||
                      (this.props.allowEditation && this.props.event.massage.client.sub === Auth.getSub())
                        ? Util.WARNING_COLOR
                        : Util.ERROR_COLOR
                  }}
                >
                  <strong>{this.props.event.massage.client.email}</strong>
                </p>
              </dd>
            )}
          </dl>
        </Col>

        <Col md="4">
          <dl>
            <dt>{_t.translate("Masseur/Masseuse")}</dt>
            <dd className={this.definitionClass}>
              {`${this.props.event.massage.masseuse.name} ${this.props.event.massage.masseuse.surname}`}
            </dd>
            <dt>{_t.translate("Duration")}</dt>
            <dd className={this.definitionClass}>
              {`${moment
                .duration(moment(this.props.event.massage.ending).diff(this.props.event.massage.date))
                .asMinutes()} ${_t.translate("minutes")}`}
            </dd>
          </dl>
        </Col>

        <Col md="4">
          <dl>
            <dt>{_t.translate("Contact")}</dt>
            <dd className={this.definitionClass}>{this.props.event.massage.masseuse.email}</dd>
            <dt>{_t.translate("Date")}</dt>
            <dd className={this.definitionClass}>{moment(this.props.event.massage.date).format("L")}</dd>
          </dl>
        </Col>
      </Row>

      <ModalActions
        primaryLabel={Auth.isMasseur() && this.props.event.massage.client === null ? "none" : this.props.label}
        disabled={this.props.disabled}
        onProceed={this.props.onConfirm}
        onClose={this.props.onClose}
      >
        {this.createChildrenButton()}
      </ModalActions>
    </ModalBody>
  );

  render() {
    return this.props.withPortal ? (
      <Modal size="lg" isOpen toggle={this.props.onClose} tabIndex="-1" onKeyPress={this.handleModalKeyPress}>
        {this.createInsides()}
      </Modal>
    ) : (
      this.createInsides()
    );
  }
}

MassageEventModal.propTypes = {
  /** event to be displayed */
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
        masseur: PropTypes.bool,
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
  /** primary button label */
  label: PropTypes.string.isRequired,
  /** function called on modal dismissal */
  onClose: PropTypes.func.isRequired,
  /** function called on primary label action */
  onConfirm: PropTypes.func.isRequired,
  /** whether the delete button should be shown */
  allowDeletion: PropTypes.bool,
  /** whether the edit button should be shown */
  allowEditation: PropTypes.bool,
  /** whether the primary button should be disabled */
  disabled: PropTypes.bool,
  /** function called on edit button action */
  onEdit: PropTypes.func,
  /** function called on delete button action */
  onDelete: PropTypes.func,
  /** whether ModalContainer should be used; useful for testing to avoid portals */
  withPortal: PropTypes.bool
};

MassageEventModal.defaultProps = {
  allowDeletion: true,
  allowEditation: true,
  disabled: false,
  onEdit() {},
  onDelete() {},
  withPortal: true
};

export default MassageEventModal;
