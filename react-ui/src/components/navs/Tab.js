// react imports
import React, { Component } from "react";
import PropTypes from "prop-types";

/**
 * Single labeled Tab component used in navigation tabbing.
 */
class Tab extends Component {
  shouldComponentUpdate(nextProps) {
    return this.props.active !== nextProps.active || this.props.label !== nextProps.label;
  }

  handleKeyPress = event => {
    if (event.charCode === 13) {
      this.props.onClick();
    }
  };

  render() {
    return (
      <li className={this.props.active ? "active" : ""}>
        {this.props.active ? (
          <a style={{ fontSize: "16px" }}>{this.props.label}</a>
        ) : (
          <a
            style={{ cursor: "pointer", color: "#888", fontSize: "16px" }}
            onClick={this.props.onClick}
            onKeyPress={this.handleKeyPress}
            role="menuitem"
            tabIndex="-1"
          >
            {this.props.label}
          </a>
        )}
      </li>
    );
  }
}

Tab.propTypes = {
  /** whether the tab is the active one */
  active: PropTypes.bool,
  /** tab title label */
  label: PropTypes.string,
  /** function called on tab click */
  onClick: PropTypes.func
};

Tab.defaultProps = {
  active: false,
  label: "Tab",
  onClick: null
};

export default Tab;
