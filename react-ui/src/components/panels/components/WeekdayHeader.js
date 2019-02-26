// react imports
import React, { Component } from "react";
import PropTypes from "prop-types";

/**
 * Calendar day header for week view.
 */
export class Header extends Component {
  handleKeyPress = event => {
    if (event.key === "Space") {
      this.props.onClick(this.props.date);
    }
  };

  render() {
    if (this.props.active) {
      return (
        <span
          role="button"
          tabIndex="-3"
          style={{ border: "none", outline: "none" }}
          onClick={() => this.props.onClick(this.props.date)}
          onKeyPress={this.handleKeyPress}
        >
          {this.props.label}
        </span>
      );
    }

    return <span style={{ cursor: "default" }}>{this.props.label}</span>;
  }
}

const WeekdayHeader = (props, active, onClick) => <Header {...props} active={active} onClick={onClick} />;

Header.propTypes = {
  date: PropTypes.instanceOf(Date).isRequired,
  label: PropTypes.string.isRequired,
  onClick: PropTypes.func.isRequired,
  active: PropTypes.bool
};

Header.defaultProps = {
  active: false
};

export default WeekdayHeader;
