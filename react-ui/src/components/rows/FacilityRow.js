// react imports
import React, { Component } from "react";
import PropTypes from "prop-types";

// component imports
import DeleteButton from "../iconbuttons/DeleteButton";
import EditButton from "../iconbuttons/EditButton";

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
          <span className="pull-right">
            <span style={{ marginRight: "5px" }}>
              <EditButton onEdit={this.props.onEdit} />
            </span>
            <DeleteButton onDelete={this.props.onDelete} />
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
