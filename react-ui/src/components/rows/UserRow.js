// react imports
import React from "react";
import PropTypes from "prop-types";

// component imports
import ConfirmationIconButton from "../iconbuttons/ConfirmationIconButton";

// util imports
import _t from "../../util/Translations";

/**
 * Facility information row for Facilities view.
 */
const UserRow = function UserRow(props) {
  return (
    <tr>
      <td>{`${props.user.name} ${props.user.surname}`}</td>
      <td>{props.user.email}</td>
      <td>{props.user.masseur ? _t.translate("Yes") : _t.translate("No")}</td>
      <td width="55px">
        <span className="float-right">
          <ConfirmationIconButton
            className="ml-2"
            icon="trash"
            onConfirm={props.onDelete}
            tooltip={_t.translate("Delete")}
            dialogMessage={_t.translate("Are you sure? This action will affect all affiliated massages.")}
          />
        </span>
      </td>
    </tr>
  );
};

UserRow.propTypes = {
  /** the User for this row */
  user: PropTypes.shape({
    sub: PropTypes.string,
    name: PropTypes.string,
    surname: PropTypes.string,
    email: PropTypes.string,
    masseur: PropTypes.bool
  }).isRequired,
  /** function called on User delete */
  onDelete: PropTypes.func.isRequired
};

export default UserRow;
