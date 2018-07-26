// react imports
import React, { Component } from 'react';
import PropTypes from 'prop-types';

/**
 * A single number page for the Pager component.
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
  /** whether the page is the active one */
  active: PropTypes.bool,
  /** page number */
  number: PropTypes.number,
  /** function called on page click */
  onClick: PropTypes.func
};

Page.defaultProps = {
  active: false
};

export default Page
