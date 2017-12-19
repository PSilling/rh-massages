// react imports
import React, { Component } from 'react';

// component imports
import ConfirmationModal from '../modals/ConfirmationModal';

// util imports
import _t from '../../util/Translations';

/**
 * Custom delete button component with title.
 */
class BatchDeleteButton extends Component {

  state = {active: false}

  handleToggle = () => {
    this.setState({active: !this.state.active});
  }

  render() {
    return(
      <span>
        <button type="button" className="btn btn-default" onClick={this.handleToggle}
          disabled={this.props.disabled}>
          {this.props.label}
        </button>
        {this.state.active ?
          <ConfirmationModal
            message={ _t.translate('Are you sure? This action cannot be reverted.') }
            onClose={() => this.handleToggle()}
            onConfirm={() => {
              this.handleToggle();
              this.props.onDelete();
            }}
          /> : ''
        }
      </span>
    )
  }
}

export default BatchDeleteButton
