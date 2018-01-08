// react imports
import React, { Component } from 'react';
import PropTypes from 'prop-types';

// util imports
import _t from '../../util/Translations';

/**
 * Custom edit button component.
 */
class EditButton extends Component {

  render() {
    return (
      <span>
        <button style={{ 'color': '#000' }}  type="button" className="btn btn-link"
          onClick={this.props.onEdit} title={ _t.translate("Edit") }>
          <span className="glyphicon glyphicon-pencil"></span>
        </button>
      </span>
    );
  }
}

EditButton.propTypes = {
  onEdit: PropTypes.func.isRequired // function to be called on button click
};

export default EditButton
