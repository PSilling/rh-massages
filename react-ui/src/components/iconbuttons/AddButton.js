// react imports
import React, { Component } from 'react';

// util imports
import _t from '../../util/Translations';

/**
 * Custom add button component.
 */
class AddButton extends Component {

  render() {
    return(
      <span>
        <button type="button" className="btn" onClick={this.props.onAdd} title={ _t.translate("Add") }>
          <span className="glyphicon glyphicon-plus"></span>
        </button>
      </span>
    );
  }
}

export default AddButton
