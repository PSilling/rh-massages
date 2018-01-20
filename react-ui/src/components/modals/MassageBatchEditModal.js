// react imports
import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';

// component imports
import BatchButton from '../buttons/BatchButton';
import ModalActions from '../buttons/ModalActions';

// module imports
import {ModalContainer, ModalDialog} from 'react-modal-dialog';
import moment from 'moment';

// util imports
import _t from '../../util/Translations';
import Util from '../../util/Util';

/**
 * Custom modal for editing multiple Massages at once
 */
class MassageBatchEditModal extends Component {

  state = {editMasseuse: false, editDate: 1, removeClients: false,
            masseuse: "", days: "1", time: "00:00"}

   componentWillReceiveProps(nextProps) {
     if (this.props === nextProps) return;
     this.setState({
       masseuse: Util.isEmpty(nextProps.massages[0]) ? "" : nextProps.massages[0].masseuse,
       removeClients: false
     });
   }

  changeEditMasseuse = (event) => {
    this.setState({editMasseuse: event.target.checked});
  }

  changeEditDate = (event, dateCheckbox) => {
    if (event.target.checked) {
      if (dateCheckbox) {
        this.setState({editDate: 1});
      } else {
        this.setState({editDate: -1});
      }
    } else {
      if (dateCheckbox) {
        this.setState({editDate: 0});
      } else {
        this.setState({editDate: 1});
      }
    }
  }

  changeRemoveClients = (event) => {
    this.setState({removeClients: event.target.checked});
  }

  changeMasseuse = (event) => {
    this.setState({masseuse: event.target.value});
  }

  changeDays = (event) => {
    if (Util.isEmpty(event.target.value) || parseInt(event.target.value, 10) < 0
        || parseInt(event.target.value, 10) > 365) {
      return;
    }
    this.setState({days: event.target.value});
  }

  changeTime = (event) => {
    if (Util.isEmpty(event.target.value)) {
      return;
    }
    this.setState({time: event.target.value});
  }

  getDate = (date) => {
    var minutes = parseInt(this.state.days, 10) * 1440 + parseInt(this.state.time.substring(0, 2) * 60, 10)
      + parseInt(this.state.time.substring(3, 5), 10);
    if (this.state.editDate < 0) {
      if (moment(date).subtract(minutes, 'minutes').isBefore(moment().startOf('minute'))) {
        return -1;
      }
      return moment(date).subtract(minutes, 'minutes').toDate();
    } else if (this.state.editDate > 0) {
      return moment(date).add(minutes, 'minutes').toDate();
    } else {
      return date;
    }
  }

  /**
   * Handles the put request.
   */
  editMassages = () => {
    var idString = "?",
        putArray = [],
        informed = false;
    for (var i = 0; i < this.props.massages.length; i++) {
      if (this.getDate(this.props.massages[i].date) === -1 || this.getDate(this.props.massages[i].ending) === -1) {
        if (!informed) {
          Util.notify("warning",
            _t.translate('Not all massages were edited as in some cases the new date would have been before now.'),
            _t.translate('Warning'));
          informed = true;
        }
        continue;
      }
      if (idString.length > 2000) {
        break;
      }
      idString += "ids=" + this.props.massages[i].id + "&";
      putArray.push({
        date: this.getDate(this.props.massages[i].date),
        ending: this.getDate(this.props.massages[i].ending),
        masseuse: (this.state.editMasseuse) ? this.state.masseuse : this.props.massages[i].masseuse,
        client: (this.state.removeClients) ? null : this.props.massages[i].client,
        facility: {id: this.props.massages[i].facility.id}
      });
    }
    if (putArray.length > 0) {
      Util.put(Util.MASSAGES_URL + idString, putArray, () => {
        this.props.getCallback();
        this.props.onToggle(true);
      });
    }
  }

  handleModalKeyPress = (event) => {
    if (event.charCode === 13 && document.activeElement === ReactDOM.findDOMNode(this.modalDialog)) {
      this.editMassages();
    }
  }

  handleInputKeyPress = (event) => {
    if (event.key === 'Enter') {
      this.editMassages();
    }
  }

  render() {
    return (
      <span style={{ 'marginRight': '5px' }}>
        <BatchButton onClick={() => this.props.onToggle(false)} disabled={this.props.disabled}
          label={ _t.translate('Edit selected') } />

        {this.props.active ?
          <ModalContainer onClose={() => this.props.onToggle(false)}>
            <ModalDialog onClose={() => this.props.onToggle(false)} width="50%" style={{ 'outline': 'none' }}
              tabIndex="1" onKeyPress={this.handleModalKeyPress}
              ref={(dialog) => {
                this.modalDialog = dialog;
              }}>
              <h2>
                { _t.translate('Edit Massages') }
              </h2>
              <hr />
              <div className="form-group col-md-12">
                <label className="checkbox-inline">
                  <input type="checkbox" onChange={this.changeEditMasseuse}
                    checked={this.state.editMasseuse} style={{ 'marginRight': '5px' }}
                    onKeyPress={this.handleInputKeyPress}
                  />
                  <strong>{ _t.translate('Change masseur/masseuse') }</strong>
                </label>
                <input value={this.state.masseuse} onChange={this.changeMasseuse}
                  className="form-control" onFocus={Util.moveCursorToEnd}
                  onKeyPress={this.handleInputKeyPress} type="text" maxLength="64"
                  placeholder={ _t.translate('Masseur/Masseuse') } list="masseuses"
                  disabled={!this.state.editMasseuse}
                />
                <datalist id="masseuses">
                  {this.props.masseuses.map((item) => (
                    <option key={item} value={item} />
                  ))}
                </datalist>
              </div>

              <div className="form-group col-md-12">
                <label className="checkbox-inline">
                  <input type="checkbox" onChange={(event) => this.changeEditDate(event, true)}
                    onKeyPress={this.handleInputKeyPress} style={{ 'marginRight': '5px' }}
                    checked={this.state.editDate === 0 ? false : true}
                  />
                  <strong>{ _t.translate('Shift massage date (day and time)') }</strong>
                </label>
                <div className="row">
                  <div className="col-md-2">
                    <input value={this.state.days} onChange={this.changeDays} className="form-control"
                      onKeyPress={this.handleInputKeyPress} autoFocus onFocus={Util.moveCursorToEnd}
                      type="number" min="0" max="365" placeholder={ _t.translate('Day change') }
                      title={ _t.translate('Days') }
                      disabled={this.state.editDate === 0 ? true : false}
                    />
                  </div>

                  <div className="col-md-3">
                    <input value={this.state.time} onChange={this.changeTime}
                      className="form-control" onKeyPress={this.handleInputKeyPress}
                      type="time" placeholder={ _t.translate('Duration change') }
                      disabled={this.state.editDate === 0 ? true : false}
                    />
                  </div>

                  <div className="col-md-4" style={{ 'marginTop': '5px' }}>
                    <label className="checkbox-inline">
                      <input type="checkbox" onChange={(event) => this.changeEditDate(event, false)}
                        checked={this.state.editDate < 0 ? true : false} onKeyPress={this.handleInputKeyPress}
                        disabled={this.state.editDate === 0 ? true : false}
                        style={{ 'marginRight': '5px' }}
                      />
                      <strong>{ _t.translate('...earlier') }</strong>
                    </label>
                  </div>
                </div>
              </div>

              <div className="form-group col-md-12">
                <label className="checkbox-inline">
                  <input type="checkbox" onChange={this.changeRemoveClients}
                    checked={this.state.removeClients} style={{ 'marginRight': '5px' }}
                    onKeyPress={this.handleInputKeyPress}
                  />
                  <strong>{ _t.translate('Also remove all assigned clients') }</strong>
                </label>
              </div>
              <ModalActions
                primaryLabel={ _t.translate('Edit') }
                onProceed={this.editMassages}
                onClose={() => this.props.onToggle(false)}
                autoFocus={false}
              />
            </ModalDialog>
          </ModalContainer> : ''
        }
      </span>
    )
  }
}

MassageBatchEditModal.propTypes = {
  active: PropTypes.bool, // whether the dialog should be shown
  disabled: PropTypes.bool, // whether the trigger button should be disabled or not
  massages: PropTypes.arrayOf(PropTypes.object).isRequired, // Massages to be copied
  masseuses: PropTypes.arrayOf(PropTypes.string), // unique Massage masseuses of the given Facility
  getCallback: PropTypes.func.isRequired, // callback function for Massage list update
  onToggle: PropTypes.func.isRequired // function called on modal toggle
};

export default MassageBatchEditModal
