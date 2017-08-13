// react imports
import React, { Component } from 'react';


// component imports
import AddButton from './AddButton';
import MasseuseSelect from './MasseuseSelect';
import ModalActions from './ModalActions';

// module imports
import {ModalContainer, ModalDialog} from 'react-modal-dialog';
import moment from 'moment';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

// util imports
import _t from '../utils/Translations.js';
import Util from '../utils/Util.js';

class MassageModal extends Component {

  state = {date: moment(), masseuse: -1}

  /**
   * Sets default input values on props change.
   */
  componentWillReceiveProps(nextProps) {
    if(this.props === nextProps) return;

    this.setState({
      date: (nextProps.massage === -1) ? moment() : moment(nextProps.massage.date),
      masseuse: (nextProps.massage === -1) ? -1 : nextProps.massage.masseuse.id
    });
  }

  changeMasseuse = (id) => {
    this.setState({masseuse: id});
  }

  changeDate = (date) => {
    this.setState({date: date});
  }

  /**
   * Handles the post request.
   */
  addMassage = () => {
    Util.post("/api/massages", {
      date: this.state.date,
      masseuse: this.state.user,
      user: null,
      facility: {name: this.props.facilityName}
    }, this.props.getCallback);
  }

  /**
   * Handles the put request.
   */
  editMassage = () => {
    Util.put("/api/massages/" + this.props.massage.id, {
      date: this.state.date,
      masseuse: this.state.user,
      user: this.props.massage.user,
      facility: this.props.massage.facility
    }, this.props.getCallback);
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
                <label>{ _t.translate('Masseuse') }</label>
                <MasseuseSelect
                  value={this.state.masseuse}
                  onChange={(id) => this.changeMasseuse(id)}
                />
              </div>
              <div className="form-group">
                <label>{ _t.translate('Time of the massage') }</label>
                <DatePicker
                  selected={this.state.date}
                  onChange={this.changeDate}
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
