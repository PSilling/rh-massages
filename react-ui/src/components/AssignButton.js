// react imports
import React, { Component } from 'react';

// component imports
import ConfirmationModal from '../components/ConfirmationModal';

// util imports
import _t from '../utils/Translations.js';

/**
 * Custom assign myself button component.
 */
class AssignButton extends Component {

  state = {active: false}

  handleToggle = () => {
    this.setState({active: !this.state.active});
  }

  render() {
    return(
      <span>
        <button type="button" className="btn btn-success pull-right" onClick={this.handleToggle}>
          { _t.translate('Assign me') }
        </button>
        {this.state.active ?
          <ConfirmationModal
            message={ _t.translate('Are you sure you want to assign yourself to this massage?') }
            onClose={this.handleToggle}
            onConfirm={this.props.onAssign}
          /> : ''
        }
      </span>
    )
  }
}

export default AssignButton
