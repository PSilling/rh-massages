// react imports
import React, { Component } from 'react';
import PropTypes from 'prop-types';

// component imports
import ConfirmationModal from '../modals/ConfirmationModal';

// util imports
import _t from '../../util/Translations';

/**
 * A button used for Massage cancellation. Contains a ConfirmationModal to confirm
 * the action.
 */
class CancelButton extends Component {

  state = {active: false}

  handleToggle = () => {
    this.setState({active: !this.state.active});
  }

  render() {
    return (
      <span>
        <button type="button" className="btn btn-warning pull-right" onClick={this.handleToggle}
          disabled={this.props.disabled} title={this.props.disabled ? _t.translate('Too late to cancel this massage') : "" }>
          { _t.translate('Cancel') }
        </button>
        {this.state.active ?
          <ConfirmationModal
            message={ _t.translate('Are you sure you want to cancel this massage?') }
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

CancelButton.propTypes = {
  /** function to be called on action confirmation */
  onCancel: PropTypes.func.isRequired,
  /** whether the button should be disabled */
  disabled: PropTypes.bool
};

CancelButton.defaultProps = {
  disabled: false
};

export default CancelButton
