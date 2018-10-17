// react imports
import React from "react";
import PropTypes from "prop-types";

// util imports
import _t from "../../util/Translations";

/**
 * Icon only button used for element editing.
 */
const EditButton = function EditButton(props) {
  return (
    <span>
      <button
        style={{ color: "#000" }}
        type="button"
        className="btn btn-link"
        onClick={props.onEdit}
        title={_t.translate("Edit")}
      >
        <span className="glyphicon glyphicon-pencil" />
      </button>
    </span>
  );
};

EditButton.propTypes = {
  /** function to be called on button click */
  onEdit: PropTypes.func.isRequired
};

export default EditButton;
