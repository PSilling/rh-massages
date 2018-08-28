// react imports
import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';

// component imports
import EditButton from '../iconbuttons/EditButton';
import DeleteButton from '../iconbuttons/DeleteButton';
import ModalActions from '../buttons/ModalActions';

// module imports
import moment from 'moment';
import {ModalContainer, ModalDialog} from 'react-modal-dialog';

// util imports
import Auth from '../../util/Auth';
import _t from '../../util/Translations';
import Util from '../../util/Util';

/**
 * Modal displaying details about a given Massage event.
 * Also supports assignment management.
 */
class MassageEventModal extends Component {

  definitionStyle = { 'marginBottom': '0.75em'}

  handleModalKeyPress = (event) => {
    if (event.charCode === 13 && document.activeElement === ReactDOM.findDOMNode(this.modalDialog)) {
      this.props.onClose();
    }
  }

  handleInputKeyPress = (event) => {
    if (event.charCode === 13) {
      this.props.onClose();
    }
  }

  render() {
    return (
      <ModalContainer onClose={this.props.onClose}>
        <ModalDialog onClose={this.props.onClose} width="40%" style={{ 'outline': 'none' }}
          tabIndex="1" onKeyPress={this.handleModalKeyPress}
          ref={(dialog) => {
            this.modalDialog = dialog;
          }}>
          <h2>
            { _t.translate('Details') }
            {Auth.isAdmin() ?
              <div className="pull-right">
                {this.props.allowEditation ? <EditButton onEdit={this.props.onEdit} /> : ''}
                <DeleteButton onDelete={this.props.onDelete} />
              </div> : ''
            }
          </h2>
          <hr />
          <div className="row">
            <div className="col-md-4">
              <dl>
                <dt>{ _t.translate('Facility') }</dt>
                <dd style={this.definitionStyle}>{this.props.event.massage.facility.name}</dd>
                <dt>{ _t.translate('Time') }</dt>
                <dd style={this.definitionStyle}>{moment(this.props.event.massage.date).format("HH:mm") + '–' + moment(this.props.event.massage.ending).format("HH:mm")}</dd>
                <dt>{ _t.translate('Client') }</dt>
                {Util.isEmpty(this.props.event.massage.client) ?
                  <dd style={this.definitionStyle}>
                    <p className="text-success">
                      <strong>{ _t.translate('Free') }</strong>
                    </p>
                  </dd> :
                  <dd style={this.definitionStyle}>
                    <p className={this.props.allowEditation && this.props.event.massage.client.sub === Auth.getSub() ? 'text-warning' : 'text-danger'}>
                      <strong>{this.props.event.massage.client.email}</strong>
                    </p>
                  </dd>
                }
              </dl>
            </div>

            <div className="col-md-4">
              <dl>
                <dt>{ _t.translate('Masseur/Masseuse') }</dt>
                <dd style={this.definitionStyle}>{this.props.event.massage.masseuse}</dd>
                <dt>{ _t.translate('Duration') }</dt>
                <dd style={this.definitionStyle}>{moment.duration(moment(this.props.event.massage.ending).diff(this.props.event.massage.date)).asMinutes() + " " + _t.translate('minutes')}</dd>
              </dl>
            </div>

            <div className="col-md-4">
              <dl>
                <dt>{ _t.translate('Date') }</dt>
                <dd style={this.definitionStyle}>{moment(this.props.event.massage.date).format("L")}</dd>
              </dl>
            </div>
          </div>

          <ModalActions
            primaryLabel={this.props.label}
            title={this.props.disabled ? _t.translate('Maximal simultaneous massage time per user would be exceeded') : ""}
            disabled={this.props.disabled}
            onProceed={this.props.onConfirm}
            onClose={this.props.onClose}>
            {this.props.label === _t.translate('Assign me') ?
              <a href={Util.addToCalendar(this.props.event.massage)} target="_blank" tabIndex="-1">
                <button type="button" className="btn btn-primary" disabled={this.props.disabled}
                  title={this.props.disabled ?
                    _t.translate('Maximal simultaneous massage time per user would be exceeded') :
                    _t.translate('Assigns this massage and opens a predefined Google event editor in a new tab')
                  }
                  onClick={this.props.onConfirm} style={{ 'marginRight': '5px' }}>
                  { _t.translate('Assign and add to calendar') }
                </button>
              </a> : ''
            }
          </ModalActions>
        </ModalDialog>
      </ModalContainer> : ''
    )
  }
}

MassageEventModal.propTypes = {
  /** event to be displayed */
  event: PropTypes.object.isRequired,
  /** primary button label */
  label: PropTypes.string.isRequired,
  /** whether the primary button should be disabled */
  disabled: PropTypes.bool.isRequired,
  /** whether non-delete administration should be enabled (false if archive) */
  allowEditation: PropTypes.bool,
  /** function called on primary label action */
  onConfirm: PropTypes.func.isRequired,
  /** function called on modal dismissal */
  onClose: PropTypes.func.isRequired,
  /** function called on edit button action */
  onEdit: PropTypes.func,
  /** function called on delete button action */
  onDelete: PropTypes.func.isRequired
}

MassageEventModal.defaultProps = {
    allowEditation: true
}

export default MassageEventModal
