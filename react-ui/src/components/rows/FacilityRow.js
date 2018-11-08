// react imports
import React, { Component } from "react";
import PropTypes from "prop-types";

// component imports
import ConfirmationIconButton from "../iconbuttons/ConfirmationIconButton";
import TooltipIconButton from "../iconbuttons/TooltipIconButton";

// util imports
import _t from "../../util/Translations";

/**
 * Facility information row for Facilities view.
 */
class FacilityRow extends Component {
  shouldComponentUpdate(nextProps) {
    return this.props.facility.id !== nextProps.facility.id || this.props.facility.name !== nextProps.facility.name;
  }

  render() {
    return (
      <tr>
        <td>{this.props.facility.name}</td>
        <td width="105px">
          <span className="float-right">
            <TooltipIconButton icon="edit" onClick={this.props.onEdit} tooltip={_t.translate("Edit")} />
            <ConfirmationIconButton
              className="ml-2"
              icon="trash"
              onConfirm={this.props.onDelete}
              tooltip={_t.translate("Delete")}
            />
          </span>
        </td>
      </tr>
    );
  }
}

FacilityRow.propTypes = {
  /** the facility for this row */
  facility: PropTypes.shape({
    id: PropTypes.number,
    name: PropTypes.string
  }).isRequired,
  /** function called on Facility edit */
  onEdit: PropTypes.func.isRequired,
  /** function called on Facility delete */
  onDelete: PropTypes.func.isRequired
};

export default FacilityRow;
