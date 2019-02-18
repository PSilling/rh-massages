// react imports
import React, { Component } from "react";
import PropTypes from "prop-types";

// module imports
import { Row, Col, Modal, ModalBody } from "reactstrap";

// component imports
import ModalActions from "../buttons/ModalActions";
import LabeledInput from "../formitems/LabeledInput";
import TooltipIconButton from "../iconbuttons/TooltipIconButton";

// util imports
import _t from "../../util/Translations";
import Fetch from "../../util/Fetch";
import Util from "../../util/Util";

/**
 * Input Modal for Facility management. Allows the change of Facility name.
 * Based on given values can be used for both creating and editing of Facilities.
 */
class FacilityModal extends Component {
  state = { name: "" };

  componentWillReceiveProps(nextProps) {
    if (this.props === nextProps) return;

    this.setState({
      name: nextProps.facility === null ? "" : nextProps.facility.name
    });
  }

  changeName = event => {
    this.setState({ name: event.target.value });
  };

  addFacility = () => {
    if (Util.isEmpty(this.state.name)) {
      Util.notify("error", "", _t.translate("Name is required!"));
      return;
    }
    Fetch.post(
      Util.FACILITIES_URL,
      {
        name: this.state.name
      },
      () => {
        this.props.onToggle();
        this.props.getCallback();
      }
    );
  };

  editFacility = () => {
    if (Util.isEmpty(this.state.name)) {
      Util.notify("error", "", _t.translate("Name is required!"));
      return;
    }
    Fetch.put(
      Util.FACILITIES_URL + this.props.facility.id,
      {
        name: this.state.name
      },
      () => {
        this.props.onToggle();
        this.props.getCallback();
      }
    );
  };

  handleKeyPress = event => {
    if (event.key === "Enter" && document.activeElement.tabIndex === -1) {
      if (this.props.facility === null) {
        this.addFacility();
      } else {
        this.editFacility();
      }
    }
  };

  createInsides = () => (
    <ModalBody>
      <Row>
        <Col md="12">
          <h3>{this.props.facility === null ? _t.translate("New facility") : _t.translate("Edit facility")}</h3>
          <hr />
        </Col>
      </Row>

      <Row>
        <LabeledInput
          label={_t.translate("Name")}
          value={this.state.name}
          onChange={this.changeName}
          onEnterPress={this.props.facility === null ? this.addFacility : this.editFacility}
          type="text"
          maxLength="64"
        />
      </Row>
      {this.props.facility === null ? (
        <ModalActions primaryLabel={_t.translate("Add")} onProceed={this.addFacility} onClose={this.props.onToggle} />
      ) : (
        <ModalActions primaryLabel={_t.translate("Edit")} onProceed={this.editFacility} onClose={this.props.onToggle} />
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
      <div className="float-right">
        <TooltipIconButton icon="plus" onClick={this.props.onToggle} tooltip={_t.translate("Create a new facility")} />

        {this.props.active && this.createModal()}
      </div>
    );
  }
}

FacilityModal.propTypes = {
  /** whether the dialog should be shown */
  active: PropTypes.bool.isRequired,
  /** callback function for Facility list update */
  getCallback: PropTypes.func.isRequired,
  /** function called on modal toggle */
  onToggle: PropTypes.func.isRequired,
  /** Facility to be possibly edited or null when adding */
  facility: PropTypes.shape({
    id: PropTypes.number,
    name: PropTypes.string
  }),
  /** whether ModalContainer should be used; useful for testing to avoid portals */
  withPortal: PropTypes.bool
};

FacilityModal.defaultProps = {
  facility: null,
  withPortal: true
};

export default FacilityModal;
