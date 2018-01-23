// react imports
import React, { Component } from 'react';
import PropTypes from 'prop-types';

// util imports
import _t from '../../util/Translations';

/**
 * Icon only button used for element addition.
 */
class AddButton extends Component {

  render() {
    return (
      <span>
        <button type="button" className="btn btn-default" onClick={this.props.onAdd}
          title={ _t.translate("Add") }>
          <span className="glyphicon glyphicon-plus"></span>
        </button>
      </span>
    );
  }
}

AddButton.propTypes = {
  /** function to be called on button click */
  onAdd: PropTypes.func.isRequired
};

export default AddButton
