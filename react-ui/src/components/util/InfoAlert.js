// react imports
import React from "react";
import PropTypes from "prop-types";

// util imports
import _t from "../../util/Translations";

/**
 * Bootsrap information alert panel for basic information distribution.
 */
const InfoAlert = function InfoAlert(props) {
  return (
    <div className="alert alert-info alert-dismissible" style={{ marginBottom: "15px" }}>
      <button type="button" className="close" aria-label="Close" onClick={props.onClose} title={_t.translate("Close")}>
        <span aria-hidden="true">&times;</span>
      </button>
      {props.children}
    </div>
  );
};

InfoAlert.propTypes = {
  /** message elements of the alert */
  children: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.node), PropTypes.node], PropTypes.string).isRequired,
  /** function to be called on dismiss */
  onClose: PropTypes.func.isRequired
};

export default InfoAlert;
