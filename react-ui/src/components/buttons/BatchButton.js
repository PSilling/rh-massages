// react imports
import React from "react";
import PropTypes from "prop-types";

/**
 * A default styled button component with a given label. Used primarily for
 * batch operation buttons but can be used for any label-only button.
 */
const BatchButton = function BatchButton(props) {
  return (
    <span>
      <button
        type="button"
        className={`btn btn-default${props.active ? " active" : ""}`}
        onClick={props.onClick}
        disabled={props.disabled}
      >
        {props.label}
      </button>
    </span>
  );
};

BatchButton.propTypes = {
  /** function to be called on button click */
  onClick: PropTypes.func.isRequired,
  /** whether the button should be displayed as active or not */
  active: PropTypes.bool,
  /** whether the button should be disabled */
  disabled: PropTypes.bool,
  /** button label to be displayed */
  label: PropTypes.string
};

BatchButton.defaultProps = {
  active: false,
  disabled: false,
  label: "Action"
};

export default BatchButton;
