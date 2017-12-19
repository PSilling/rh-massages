// react imports
import React, { Component } from 'react';

/**
 * Custom button component with title.
 */
class BatchButton extends Component {

  render() {
    return(
      <span>
        <button type="button" className="btn btn-default" onClick={this.props.onSubmit}
          disabled={this.props.disabled}>
          {this.props.label}
        </button>
      </span>
    )
  }
}

export default BatchButton
