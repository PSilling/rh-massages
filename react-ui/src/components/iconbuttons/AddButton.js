// react imports
import React, { Component } from 'react';
import PropTypes from 'prop-types';

// util imports
import _t from '../../util/Translations';

/**
 * Custom add button component.
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
  onAdd: PropTypes.func.isRequired // function to be called on button click
};

export default AddButton
