// react imports
import React, { Component } from 'react';


// component imports
import AddButton from './AddButton';
import ModalActions from './ModalActions';

// module imports
import {ModalContainer, ModalDialog} from 'react-modal-dialog';
import moment from 'moment';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import './MassageModal.css';

// util imports
import Auth from '../utils/Auth.js';
import _t from '../utils/Translations.js';
import Util from '../utils/Util.js';

class MassageModal extends Component {

  state = {date: moment(), masseuse: ""}

  /**
   * Sets default input values on props change.
   */
  componentWillReceiveProps(nextProps) {
    if(this.props === nextProps) return;

    this.setState({
      date: (nextProps.massage === -1) ? moment() : moment(nextProps.massage.date),
      masseuse: (nextProps.massage === -1) ? "" : nextProps.massage.masseuse
    });
  }

  changeMasseuse = (event) => {
    this.setState({masseuse: event.target.value});
  }

  changeDate = (date) => {
    this.setState({date: date});
  }

  /**
   * Handles the post request.
   */
  addMassage = () => {
    Util.post(Util.MASSAGES_URL, {
      date: this.state.date.toDate(),
      masseuse: this.state.masseuse,
      client: null,
      facility: {id: this.props.facilityId}
    }, () => {
      this.props.onToggle();
      this.props.getCallback();
    });
  }

  /**
   * Handles the put request.
   */
  editMassage = () => {
    Util.put(Util.MASSAGES_URL + this.props.massage.id, {
      date: this.state.date.toDate(),
      masseuse: this.state.masseuse,
      client: this.props.massage.client,
      facility: this.props.massage.facility
    }, () => {
      this.props.onToggle();
      this.props.getCallback();
    });
  }

  render() {
    return(
      <div className='pull-right'>
        <AddButton onAdd={this.props.onToggle} />

        {this.props.active ?
          <ModalContainer onClose={this.props.onToggle}>
            <ModalDialog onClose={this.props.onToggle} width="50%">
              <h2>
                {this.props.massage === -1 ?
                  _t.translate('New Massage') : _t.translate('Edit Massage')
                }
              </h2>
              <hr />
              <div className="form-group">
                <div className="form-group">
                  <label>{ _t.translate('Masseuse') }</label>
                  <input value={this.state.masseuse} onChange={this.changeMasseuse}
                    className="form-control" />
                </div>
              </div>
              <div className="form-group">
                <label>{ _t.translate('Massage time') }</label>
                <DatePicker
                  selected={this.state.date}
                  onChange={this.changeDate}
                  minDate={moment()}
                  dateFormat="DD. MM. HH:mm"
                  todayButton={ _t.translate('Now') }
                  className="btn btn-default"
                />
              </div>
              {this.props.massage === -1 ?
                <ModalActions
                  primaryLabel={ _t.translate('Add') }
                  onProceed={this.addMassage}
                  onClose={this.props.onToggle}
                /> :
                <ModalActions
                  primaryLabel={ _t.translate('Edit') }
                  onProceed={this.editMassage}
                  onClose={this.props.onToggle}
                />
              }
            </ModalDialog>
          </ModalContainer> : ''
        }
      </div>
    )
  }
}

export default MassageModal
