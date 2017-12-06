// react imports
import React, { Component } from 'react';
import ReactDOM from 'react-dom';

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

  state = {date: moment(), time: "01:00", masseuse: ""}

  /**
   * Sets default input values on props change.
   */
  componentWillReceiveProps(nextProps) {
    if (this.props === nextProps) return;

    this.setState({
      date: (nextProps.massage === -1) ? moment() : moment(nextProps.massage.date),
      time: (nextProps.massage === -1) ? "01:00" :
        moment.utc(moment(nextProps.massage.ending).diff(moment(nextProps.massage.date))).format("HH:mm"),
      masseuse: (nextProps.massage === -1) ? "" : nextProps.massage.masseuse
    });
  }

  changeMasseuse = (event) => {
    this.setState({masseuse: event.target.value});
  }

  changeDate = (date) => {
    this.setState({date: date});
  }

  changeTime = (event) => {
    this.setState({time: event.target.value});
  }

  getEndingDate = () => {
    var minutes = parseInt(this.state.time.substring(0, 2) * 60) + parseInt(this.state.time.substring(3, 5));
    return this.state.date.add(minutes, 'minutes').toDate();
  }

  /**
   * Handles the post request.
   */
  addMassage = () => {
    if (Util.isEmpty(this.state.masseuse)) {
      Util.notify("error", "", _t.translate('Masseuse is required!'));
      return;
    }
    Util.post(Util.MASSAGES_URL, {
      date: this.state.date.toDate(),
      ending: this.getEndingDate(),
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
    if (Util.isEmpty(this.state.masseuse)) {
      Util.notify("error", "", _t.translate('Masseuse is required!'));
      return;
    }
    Util.put(Util.MASSAGES_URL + this.props.massage.id, {
      date: this.state.date.toDate(),
      ending: this.getEndingDate(),
      masseuse: this.state.masseuse,
      client: this.props.massage.client,
      facility: this.props.massage.facility
    }, () => {
      this.props.onToggle();
      this.props.getCallback();
    });
  }

  handleModalKeyPress = (event) => {
    if (event.charCode === 13 && document.activeElement === ReactDOM.findDOMNode(this.modalDialog)) {
      if (this.props.massage === -1) {
        this.addMassage();
      } else {
        this.editMassage();
      }
    }
  }

  handleInputKeyPress = (event) => {
    if (event.key === 'Enter') {
      if (this.props.massage === -1) {
        this.addMassage();
      } else {
        this.editMassage();
      }
    }
  }

  moveCursorToEnd = (event) => {
    var value = event.target.value;
    event.target.value = '';
    event.target.value = value;
  }

  render() {
    return(
      <div className='pull-right'>
        <AddButton onAdd={this.props.onToggle} />

        {this.props.active ?
          <ModalContainer onClose={this.props.onToggle}>
            <ModalDialog onClose={this.props.onToggle} width="50%" style={{ 'outline': 'none' }}
              tabIndex="1" onKeyPress={this.handleModalKeyPress}
              ref={(dialog) => {
                this.modalDialog = dialog;
              }}>
              <h2>
                {this.props.massage === -1 ?
                  _t.translate('New Massage') : _t.translate('Edit Massage')
                }
              </h2>
              <hr />
              <div className="form-group">
                <div className="form-group col-md-12">
                  <label>{ _t.translate('Masseuse') }</label>
                  <input value={this.state.masseuse} onChange={this.changeMasseuse}
                    className="form-control" autoFocus onFocus={this.moveCursorToEnd}
                    onKeyPress={this.handleInputKeyPress} type="text" maxLength="64"
                    placeholder={ _t.translate('Masseuse') }
                  />
                </div>
              </div>
              <div className="form-group col-md-12">
                <label>{ _t.translate('Duration') }</label><br />
                <div className="row">
                  <div className="col-md-3">
                    <input value={this.state.time} onChange={this.changeTime}
                      className="form-control" onKeyPress={this.handleInputKeyPress}
                      type="time" placeholder={ _t.translate('Duration') }
                    />
                  </div>
                </div>
              </div>
              <div className="form-group col-md-12">
                <label>{ _t.translate('Massage time') }</label>
                <DatePicker
                  selected={this.state.date}
                  onSelect={this.changeDate}
                  onChange={this.changeDate}
                  minDate={moment()}
                  dateFormat="DD. MM. HH:mm"
                  disabledKeyboardNavigation
                  todayButton={ _t.translate('Now') }
                  className="btn btn-default"
                  onFocus={this.moveCursorToEnd}
                  onKeyDown={this.handleInputKeyPress}
                />
              </div>
              {this.props.massage === -1 ?
                <ModalActions
                  primaryLabel={ _t.translate('Add') }
                  onProceed={this.addMassage}
                  onClose={this.props.onToggle}
                  autoFocus={false}
                /> :
                <ModalActions
                  primaryLabel={ _t.translate('Edit') }
                  onProceed={this.editMassage}
                  onClose={this.props.onToggle}
                  autoFocus={false}
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
