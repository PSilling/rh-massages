// react imports
import React, { Component } from 'react';
import PropTypes from 'prop-types';

/**
 * A default styled button component with a given label. Used primarily for
 * batch operation buttons but can be used for any label-only button.
 */
class BatchButton extends Component {

  render() {
    return (
      <span>
        <button type="button" className={"btn btn-default" + (this.props.active ? " active" : "")}
          onClick={this.props.onClick} disabled={this.props.disabled}>
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
  disabled: PropTypes.bool,
  /** whether the button should be displayed as active */
  active: PropTypes.bool
};

BatchButton.defaultProps = {
  disabled: false,
  active: false
};

export default BatchButton
