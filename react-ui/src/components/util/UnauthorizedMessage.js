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
    <div>
      <h1>{props.title}</h1>
      <hr />
      <h2>{_t.translate("Unauthorized")}</h2>
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
