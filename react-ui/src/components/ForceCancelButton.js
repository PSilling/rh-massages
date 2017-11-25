// react imports
import React, { Component } from 'react';

// component imports
import ConfirmationModal from '../components/ConfirmationModal';

// util imports
import _t from '../utils/Translations.js';

/**
 * Custom cancel button component for brute force cancel (canceling of an assigned massage).
 */
class ForceCancelButton extends Component {

  state = {active: false}

  handleToggle = () => {
    this.setState({active: !this.state.active});
  }

  render() {
    return(
      <span>
        <button type="button" className="btn btn-danger pull-right" onClick={this.handleToggle}>
            { _t.translate('Force cancel') }
        </button>
        {this.state.active ?
          <ConfirmationModal
            message={ _t.translate('Are you sure you want to cancel a massage that is assigned?') }
            onClose={this.handleToggle}
            onConfirm={() => {
              this.handleToggle();
              this.props.onCancel();
            }}
          /> : ''
        }
      </span>
    )
  }
}

export default ForceCancelButton
