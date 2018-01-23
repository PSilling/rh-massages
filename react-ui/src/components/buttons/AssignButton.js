// react imports
import React, { Component } from 'react';
import PropTypes from 'prop-types';

// component imports
import ConfirmationModal from '../modals/ConfirmationModal';

// util imports
import _t from '../../util/Translations';

/**
 * A button used for Massage assignment. Contains a ConfirmationModal to confirm
 * the assignment.
 */
class AssignButton extends Component {

  state = {active: false}

  handleToggle = () => {
    this.setState({active: !this.state.active});
  }

  render() {
    return (
      <span>
        <button type="button" className="btn btn-success pull-right" onClick={this.handleToggle} disabled={this.props.disabled}
          title={this.props.disabled ? _t.translate('Maximal simultaneous massage time per user would be exceeded') : "" }>
          { _t.translate('Assign me') }
        </button>
        {this.state.active ?
          <ConfirmationModal
            message={ _t.translate('Are you sure you want to assign yourself to this massage?') }
            onClose={this.handleToggle}
            onConfirm={() => {
              this.handleToggle();
              this.props.onAssign();
            }}>
            {this.props.children}
          </ConfirmationModal>
             : ''
        }
      </span>
    )
  }
}

AssignButton.propTypes = {
  /** function to be called on button click */
  onAssign: PropTypes.func.isRequired,
  /** whether the button should be disabled */
  disabled: PropTypes.bool
};

AssignButton.defaultProps = {
  disabled: false
};

export default AssignButton
