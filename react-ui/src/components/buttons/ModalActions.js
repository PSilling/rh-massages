// react imports
import React from "react";
import PropTypes from "prop-types";

// util imports
import _t from "../../util/Translations";

/**
 * Footer buttons for Modal dialogs. Children components can be given to add more
 * case specific elements.
 */
const ModalActions = function ModalActions(props) {
  return (
    <div className="pull-right">
      {props.children}
      {props.primaryLabel === "none" ? (
        ""
      ) : (
        <button
          type="button"
          className="btn btn-primary"
          onClick={props.onProceed}
          title={props.title}
          style={{ marginRight: "5px" }}
          autoFocus={props.autoFocus}
          disabled={props.disabled}
        >
          {props.primaryLabel}
        </button>
      )}
      <button type="button" className="btn btn-default" onClick={props.onClose}>
        {_t.translate("Dismiss")}
      </button>
    </div>
  );
};

ModalActions.propTypes = {
  /** callback function triggered on close button click */
  onClose: PropTypes.func.isRequired,
  /** callback function triggered on primary button click */
  onProceed: PropTypes.func.isRequired,
  /** whether the primary button should be automatically focused */
  autoFocus: PropTypes.bool,
  /** extra elements to be provided before the two buttons */
  children: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.node), PropTypes.node]),
  /** whether the primary button should be disabled */
  disabled: PropTypes.bool,
  /** primary button label to be displayed */
  primaryLabel: PropTypes.string,
  /** primary button title */
  title: PropTypes.string
};

ModalActions.defaultProps = {
  autoFocus: false,
  children: null,
  disabled: false,
  primaryLabel: _t.translate("Proceed"),
  title: ""
};

export default ModalActions;
