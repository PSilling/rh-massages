// react imports
import React, { Component } from 'react';
import PropTypes from 'prop-types';

/**
 * A default styled button component with a given label. Used primarily for
 * batch operation buttons.
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
  /** function to be called on button click */
  onClick: PropTypes.func.isRequired,
   /** button label */
  label: PropTypes.string,
  /** whether the button should be disabled */
  disabled: PropTypes.bool
};

BatchButton.defaultProps = {
  disabled: false
};

export default BatchButton
