// react imports
import React, { Component } from 'react';
import PropTypes from 'prop-types';

// component imports
import ConfirmationModal from '../modals/ConfirmationModal';

// util imports
import _t from '../../util/Translations';

/**
 * Custom cancel button component for brute force cancel (canceling of an assigned massage).
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
  onCancel: PropTypes.func.isRequired // function to be called on button click
};

export default ForceCancelButton
