// react imports
import React, { Component } from 'react';

/**
 * Custom edit button component.
 */
class EditButton extends Component {

  render() {
    return(
      <span>
        <button style={{ 'color': '#000' }}  type="button" className="btn btn-link" onClick={this.props.onEdit}>
          <span className="glyphicon glyphicon-pencil"></span>
        </button>
      </span>
    );
  }
}

export default EditButton
