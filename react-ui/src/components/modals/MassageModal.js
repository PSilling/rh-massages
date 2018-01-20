// react imports
import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';

// component imports
import AddButton from '../iconbuttons/AddButton';
import ModalActions from '../buttons/ModalActions';

// module imports
import {ModalContainer, ModalDialog} from 'react-modal-dialog';
import moment from 'moment';

// util imports
import _t from '../../util/Translations';
import Util from '../../util/Util';

class MassageModal extends Component {

  state = {date: moment().add(1, 'hours').format("YYYY-MM-DDTHH:mm"), time: "00:30", masseuse: ""}

  /**
   * Sets default input values on props change.
   */
  componentWillReceiveProps(nextProps) {
    if (this.props === nextProps) return;

    this.setState({
      date: (nextProps.massage === null) ? moment().add(1, 'hours').format("YYYY-MM-DDTHH:mm") :
        moment(nextProps.massage.date).format("YYYY-MM-DDTHH:mm"),
      time: (nextProps.massage === null) ? "00:30" :
        moment.utc(moment(nextProps.massage.ending).diff(moment(nextProps.massage.date))).format("HH:mm"),
      masseuse: (nextProps.massage === null) ? "" : nextProps.massage.masseuse
    });
  }

  changeMasseuse = (event) => {
    this.setState({masseuse: event.target.value});
  }

  changeDate = (event) => {
    if (Util.isEmpty(event.target.value) || moment(event.target.value).isBefore(moment().startOf('minute'))) {
      return;
    }
    this.setState({date: event.target.value});
  }

  changeTime = (event) => {
    if (Util.isEmpty(event.target.value)) {
      return;
    }
    this.setState({time: event.target.value});
  }

  getStartingDate = () => {
    if (moment(this.state.date).isBefore(moment().startOf('minute'))) {
      this.setState({date: moment().startOf('minute').format("YYYY-MM-DDTHH:mm")});
      return moment().startOf('minute').toDate();
    } else {
      return moment(this.state.date).toDate();
    }
  }

  getEndingDate = (date) => {
    var minutes = parseInt(this.state.time.substring(0, 2) * 60, 10) + parseInt(this.state.time.substring(3, 5), 10);
    return moment(date).add(minutes, 'minutes').toDate();
  }

  /**
   * Handles the post request.
   */
  addMassage = () => {
    if (Util.isEmpty(this.state.masseuse)) {
      Util.notify("error", "", _t.translate('Masseuse is required!'));
      return;
    }
    var date = this.getStartingDate();
    Util.post(Util.MASSAGES_URL, [{
      date: moment(date).toDate(),
      ending: this.getEndingDate(date),
      masseuse: this.state.masseuse,
      client: null,
      facility: {id: this.props.facilityId}
    }], () => {
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
    var date = this.getStartingDate();
    Util.put(Util.MASSAGES_URL + "?ids=" + this.props.massage.id, [{
      date: moment(date).toDate(),
      ending: this.getEndingDate(date),
      masseuse: this.state.masseuse,
      client: this.props.massage.client,
      facility: this.props.massage.facility
    }], () => {
      this.props.onToggle();
      this.props.getCallback();
    });
  }

  handleModalKeyPress = (event) => {
    if (event.charCode === 13 && document.activeElement === ReactDOM.findDOMNode(this.modalDialog)) {
      if (this.props.massage === null) {
        this.addMassage();
      } else {
        this.editMassage();
      }
    }
  }

  handleInputKeyPress = (event) => {
    if (event.key === 'Enter') {
      if (this.props.massage === null) {
        this.addMassage();
      } else {
        this.editMassage();
      }
    }
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
                {this.props.massage === null ?
                  _t.translate('New Massage') : _t.translate('Edit Massage')
                }
              </h2>
              <hr />
              <div className="form-group col-md-12">
                <label htmlFor="masseuseInput">{ _t.translate('Masseur/Masseuse') }</label>
                <input id="masseuseInput" value={this.state.masseuse} onChange={this.changeMasseuse}
                  className="form-control" autoFocus onFocus={Util.moveCursorToEnd}
                  onKeyPress={this.handleInputKeyPress} type="text" maxLength="64"
                  placeholder={ _t.translate('Masseur/Masseuse') } list="masseuses"
                />
                <datalist id="masseuses">
                  {this.props.masseuses.map((item) => (
                    <option key={item} value={item} />
                  ))}
                </datalist>
              </div>

              <div className="form-group col-md-12">
                <label htmlFor="durationInput">{ _t.translate('Duration') }</label>
                <div className="row">
                  <div className="col-md-3">
                    <input id="durationInput" value={this.state.time} onChange={this.changeTime}
                      className="form-control" onKeyPress={this.handleInputKeyPress}
                      type="time" placeholder={ _t.translate('Duration') }
                    />
                  </div>
                </div>
              </div>

              <div className="form-group col-md-12">
                <label htmlFor="dateInput">{ _t.translate('Massage time') }</label>
                <div className="row">
                  <div className="col-md-5">
                    <input id="dateInput" value={this.state.date} onChange={this.changeDate}
                      className="form-control" onKeyPress={this.handleInputKeyPress}
                      type="datetime-local" min={moment().format("YYYY-MM-DD")}
                      placeholder={ _t.translate('Massage time') }
                    />
                  </div>
                </div>
              </div>
              {this.props.massage === null ?
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
    );
  }
}

MassageModal.propTypes = {
  active: PropTypes.bool.isRequired, // whether the dialog should be shown
  massage: PropTypes.object, // Massage to be possibly edited or null when adding
  facilityId: PropTypes.number, // ID of the selected Facility
  masseuses: PropTypes.arrayOf(PropTypes.string), // unique Massage masseuses of the given Facility
  getCallback: PropTypes.func.isRequired, // callback function for Massage list update
  onToggle: PropTypes.func.isRequired // function called on modal toggle
}

export default MassageModal
