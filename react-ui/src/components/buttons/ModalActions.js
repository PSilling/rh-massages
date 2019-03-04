// react imports
import React from "react";
import PropTypes from "prop-types";

// module imports
import { Button, Col, Row } from "reactstrap";

// util imports
import _t from "../../util/Translations";

/**
 * Footer buttons for Modal dialogs. Children components can be given to add more
 * case specific elements before the two main buttons.
 */
const ModalActions = function ModalActions(props) {
  return (
    <Row className="text-right">
      <Col md="12">
        <hr />
        {props.children}
        {props.primaryLabel !== "none" && (
          <span title={props.title}>
            <Button className="mr-2" color="primary" onClick={props.onProceed} disabled={props.disabled}>
              {props.primaryLabel}
            </Button>
          </span>
        )}
        <Button onClick={props.onClose}>{_t.translate("Dismiss")}</Button>
      </Col>
    </Row>
  );
};

ModalActions.propTypes = {
  /** callback function triggered on close button click */
  onClose: PropTypes.func.isRequired,
  /** callback function triggered on primary button click */
  onProceed: PropTypes.func.isRequired,
  /** extra elements to be provided before the two buttons */
  children: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.node), PropTypes.node]),
  /** whether the primary button should be disabled */
  disabled: PropTypes.bool,
  /** primary button label to be displayed */
  primaryLabel: PropTypes.string,
  /** title displyaed over the primary label */
  title: PropTypes.string
};

ModalActions.defaultProps = {
  children: null,
  disabled: false,
  primaryLabel: _t.translate("Proceed"),
  title: ""
};

export default ModalActions;
