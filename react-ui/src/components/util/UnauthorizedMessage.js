// react imports
import React from "react";
import PropTypes from "prop-types";

// util imports
import _t from "../../util/Translations";

/**
 * Simple title message shown to unauthorized users.
 */
const UnauthorizedMessage = function UnauthorizedMessage(props) {
  return (
    <div className="mt-3">
      <h2>{props.title}</h2>
      <hr />
      <h3>{_t.translate("Unauthorized")}</h3>
    </div>
  );
};

UnauthorizedMessage.propTypes = {
  /** title shown above unauthorized notification */
  title: PropTypes.string
};

UnauthorizedMessage.defaultProps = {
  title: "Unauthorized"
};

export default UnauthorizedMessage;
