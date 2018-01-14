// react imports
import React, { Component } from 'react';
import PropTypes from 'prop-types';

/**
 * Custom page component.
 */
class Page extends Component {

  shouldComponentUpdate(nextProps) {
    return (this.props.active !== nextProps.active
      || this.props.number !== nextProps.number);
  }

  render() {
    return (
      <li className={this.props.active ? "active" : ""}>
        {this.props.active ?
        <a>
          {this.props.number}
        </a> :
        <a onClick={this.props.onClick}
          style={{'cursor': 'pointer'}}>
          {this.props.number}
        </a>}
      </li>
    );
  }
}

Page.propTypes = {
  active: PropTypes.bool, // whether the page is the active one
  number: PropTypes.number, // page number
  onClick: PropTypes.func // function called on page click
};

Page.defaultProps = {
  active: false
};

export default Page
