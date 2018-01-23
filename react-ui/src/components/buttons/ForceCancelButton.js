// react imports
import React, { Component } from 'react';
import PropTypes from 'prop-types';

// component imports
import ConfirmationModal from '../modals/ConfirmationModal';

// util imports
import _t from '../../util/Translations';

/**
 * A button used for administrator forced Massage cancellation. Contains a ConfirmationModal
 * to confirm the action.
 */
class ForceCancelButton extends Component {

  state = {active: false}

  handleToggle = () => {
    this.setState({active: !this.state.active});
  }

  render() {
    return (
      <span>
        <button type="button" className="btn btn-danger pull-right" onClick={this.handleToggle}>
            { _t.translate('Force cancel') }
        </button>
        {this.state.active ?
          <ConfirmationModal
            message={ _t.translate('Are you sure you want to cancel a massage that is already assigned?') }
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

ForceCancelButton.propTypes = {
  /** function to be called on button click */
  onCancel: PropTypes.func.isRequired
};

export default ForceCancelButton
