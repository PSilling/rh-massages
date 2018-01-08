// react imports
import React, { Component } from 'react';
import PropTypes from 'prop-types';

/**
 * Custom button component with title.
 */
class BatchButton extends Component {

  render() {
    return (
      <span>
        <button type="button" className="btn btn-default" onClick={this.props.onClick}
          disabled={this.props.disabled}>
          {this.props.label}
        </button>
      </span>
    )
  }
}

BatchButton.propTypes = {
  onClick: PropTypes.func.isRequired, // function to be called on button click
  label: PropTypes.string, // button label
  disabled: PropTypes.bool // whether the button should be disabled
};

BatchButton.defaultProps = {
  disabled: false
};

export default BatchButton
