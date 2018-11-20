// react imports
import React, { Component } from "react";
import PropTypes from "prop-types";

// module imports
import { Button } from "reactstrap";

// util imports
import _t from "../../util/Translations";

/**
 * ErrorBoundary class. Catches any unexpected errors and renders a reload page notification.
 */
class ErrorBoundary extends Component {
  state = { error: null, errorInfo: null };

  componentDidCatch(error, errorInfo) {
    console.error("Unexpected " + error.toString() + ": " + errorInfo.componentStack); /* eslint-disable-line */
    this.setState({ error, errorInfo });
  }

  render() {
    if (this.state.error !== null) {
      return (
        <div className="mt-3">
          <h2>
            {_t.translate("An error occured!")}
            <Button className="float-right" outline onClick={() => window.location.reload()}>
              {_t.translate("Reload page")}
            </Button>
          </h2>
          <hr />
          <details style={{ cursor: "pointer" }}>
            {`${this.state.error.toString()}: `}
            <br />
            {this.state.errorInfo.componentStack}
          </details>
        </div>
      );
    }
    return this.props.children;
  }
}

ErrorBoundary.propTypes = {
  children: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.node), PropTypes.node]).isRequired
};

export default ErrorBoundary;
