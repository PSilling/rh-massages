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

  createInsides = () => (
    <ModalBody>
      <Row>
        <Col md="12">
          <h3>
            {_t.translate("Details")}
            {Auth.isAdmin() && (
              <div className="float-right">
                {this.props.allowEditation && (
                  <TooltipIconButton icon="edit" onClick={this.props.onEdit} tooltip={_t.translate("Edit")} />
                )}
                <ConfirmationIconButton
                  className="ml-2"
                  icon="trash"
                  onConfirm={this.props.onDelete}
                  tooltip={_t.translate("Delete")}
                />
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
              {`${moment(this.props.event.massage.date).format("HH:mm")}–${moment(
                this.props.event.massage.ending
              ).format("HH:mm")}`}
            </dd>
            <dt>{_t.translate("Client")}</dt>
            {Util.isEmpty(this.props.event.massage.client) ? (
              <dd className={this.definitionClass}>
                <p className="text-success">
                  <strong>{_t.translate("Free")}</strong>
                </p>
              </dd>
            ) : (
              <dd className={this.definitionClass}>
                <p
                  className={
                    this.props.allowEditation && this.props.event.massage.client.sub === Auth.getSub()
                      ? "text-warning"
                      : "text-danger"
                  }
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
            <dd className={this.definitionClass}>{this.props.event.massage.masseuse}</dd>
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
            <dt>{_t.translate("Date")}</dt>
            <dd className={this.definitionClass}>{moment(this.props.event.massage.date).format("L")}</dd>
          </dl>
        </Col>
      </Row>
      <ModalActions
        primaryLabel={this.props.label}
        disabled={this.props.disabled}
        onProceed={this.props.onConfirm}
        onClose={this.props.onClose}
      >
        {this.props.label === _t.translate("Assign me") && (
          <span>
            <Button
              id={this.tooltipTarget}
              className="mr-2"
              tag="a"
              color="primary"
              disabled={this.props.disabled}
              onClick={this.onCalendarConfirm}
              target="_blank"
              rel="noopener noreferrer"
              tabIndex="-1"
            >
              {_t.translate("Assign and add to calendar")}
            </Button>
            <Tooltip
              isOpen={this.state.tooltipActive}
              target={this.tooltipTarget}
              toggle={this.toggleTooltip}
              trigger="hover"
            >
              {this.props.disabled
                ? _t.translate("Maximal simultaneous massage time per user would be exceeded")
                : _t.translate("Assigns this massage and opens a predefined Google event editor in a new tab")}
            </Tooltip>
          </span>
        )}
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
      })
    })
  }).isRequired,
  /** primary button label */
  label: PropTypes.string.isRequired,
  /** function called on modal dismissal */
  onClose: PropTypes.func.isRequired,
  /** function called on primary label action */
  onConfirm: PropTypes.func.isRequired,
  /** whether non-delete administration should be enabled (false if archive) */
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
  allowEditation: true,
  disabled: false,
  onEdit: null,
  onDelete: null,
  withPortal: true
};

export default MassageEventModal;
