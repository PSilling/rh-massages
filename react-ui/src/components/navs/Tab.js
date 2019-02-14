// react imports
import React, { Component } from "react";
import PropTypes from "prop-types";

// module imports
import { NavItem, NavLink } from "reactstrap";

/**
 * Single labeled Tab component used in navigation tabbing.
 */
class Tab extends Component {
  shouldComponentUpdate(nextProps) {
    return this.props.active !== nextProps.active || this.props.label !== nextProps.label;
  }

  handleKeyPress = event => {
    if (event.key === "Enter") {
      this.props.onRemoveClick();
    }
  };

  render() {
    return (
      <NavItem>
        <NavLink
          style={this.props.active ? {} : { cursor: "pointer", color: "#888" }}
          className={this.props.active ? "active" : ""}
          onClick={this.props.active ? () => {} : this.props.onClick}
        >
          {this.props.label}
          {this.props.onRemoveClick !== null && this.props.active && (
            <span
              className="ml-2"
              style={{ cursor: "pointer" }}
              role="button"
              tabIndex="-2"
              onClick={this.props.onRemoveClick}
              onKeyPress={this.handleKeyPress}
            >
              &times;
            </span>
          )}
        </NavLink>
      </NavItem>
    );
  }
}

Tab.propTypes = {
  /** whether the tab is the active one */
  active: PropTypes.bool,
  /** tab title label */
  label: PropTypes.string,
  /** function called on tab click */
  onClick: PropTypes.func,
  /** function called on remove button click */
  onRemoveClick: PropTypes.func
};

Tab.defaultProps = {
  active: false,
  label: "Tab",
  onClick: null,
  onRemoveClick: null
};

export default Tab;
