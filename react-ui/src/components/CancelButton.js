// react imports
import React, { Component } from 'react';

// component imports
import ConfirmationModal from '../components/ConfirmationModal';

// util imports
import _t from '../utils/Translations.js';

/**
 * Custom cancel button component.
 */
class CancelButton extends Component {

  state = {active: false}

  handleToggle = () => {
    this.setState({active: !this.state.active});
  }

  render() {
    return(
      <span>
        <button type="button" className="btn btn-danger pull-right" onClick={this.handleToggle}>
          { _t.translate('Cancel') }
        </button>
        {this.state.active ?
          <ConfirmationModal
            message={ _t.translate('Are you sure you want to cancel this massage?') }
            onClose={this.handleToggle}
            onConfirm={this.props.onCancel}
          /> : ''
        }
      </span>
    )
  }
}

export default CancelButton
