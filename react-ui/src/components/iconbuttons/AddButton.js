// react imports
import React from "react";
import PropTypes from "prop-types";

// util imports
import _t from "../../util/Translations";

/**
 * Icon only button used for element addition.
 */
const AddButton = function AddButton(props) {
  return (
    <span>
      <button type="button" className="btn btn-default" onClick={props.onAdd} title={_t.translate("Add")}>
        <span className="glyphicon glyphicon-plus" />
      </button>
    </span>
  );
};

AddButton.propTypes = {
  /** function to be called on button click */
  onAdd: PropTypes.func.isRequired
};

export default AddButton;
