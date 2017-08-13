// react imports
import React, { Component } from 'react';

/**
 * Custom add button component.
 */
class AddButton extends Component {

  render() {
    return(
      <span>
        <button type="button" className="btn" onClick={this.props.onAdd}>
          <span className="glyphicon glyphicon-plus"></span>
        </button>
      </span>
    );
  }
}

export default AddButton
