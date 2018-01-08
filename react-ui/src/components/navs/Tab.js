// react imports
import React, { Component } from 'react';
import PropTypes from 'prop-types';

/**
 * Custom tab component.
 */
class Tab extends Component {

  shouldComponentUpdate(nextProps) {
    return (this.props.active !== nextProps.active
      || this.props.label !== nextProps.label);
  }

  render() {
    return (
      <li className={this.props.active ? "active" : ""}>
        {this.props.active ?
        <a style={{ 'fontSize': '16px' }}>
          {this.props.label}
        </a> :
        <a onClick={this.props.onClick}
          style={{'cursor': 'pointer', 'color': '#888', 'fontSize': '16px'}}>
          {this.props.label}
        </a>}
      </li>
    );
  }
}

Tab.propTypes = {
  active: PropTypes.bool, // whether the tab is the active one
  label: PropTypes.string, // tab title
  onClick: PropTypes.func // function called on tab click
};

Tab.defaultProps = {
  active: false
};

export default Tab
