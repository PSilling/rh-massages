// react imports
import React from "react";
import PropTypes from "prop-types";

// module imports
import { Alert } from "reactstrap";

/**
 * Bootsrap information alert panel for basic information distribution.
 */
const InfoAlert = function InfoAlert(props) {
  return (
    <div className="no-print my-3">
      <Alert color="info" isOpen toggle={props.onClose}>
        {props.children}
      </Alert>
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
