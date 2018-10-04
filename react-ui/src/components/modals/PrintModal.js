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
import Datetime from 'react-datetime';

// util imports
import _t from '../../util/Translations';
import Util from '../../util/Util';

/**
 * Modal dialog with printing settings.
 */
class PrintModal extends Component {

  state = {active: false, massages: [], checkedRadio: 0, filter: "", from: moment(), to: moment().add(1, "day")}

  radios = ['just today', 'this week', 'this month', 'chosen month', 'custom:']

  printMassages = () => {
    var from,
        to;
    switch (this.state.checkedRadio) {
      case 0:
        from = to = moment();
        break;
      case 1:
        from = moment().startOf("isoWeek");
        to = moment().endOf("isoWeek");
        break;
      case 2:
        from = moment().startOf("month");
        to = moment().endOf("month");
        break;
      case 3:
        from = this.props.date.clone().startOf("month");
        to = this.props.date.endOf("month");
        break;
      case 4:
        from = this.state.from;
        to = this.state.to;
        break;
      default:
        Util.notify("error", "", _t.translate('An error occured!'));
    }

    Util.get(Util.FACILITIES_URL + this.props.facilityId
      + "/massages?search=" + this.state.filter
      + "&from=" + moment(from).unix() * 1000
      + "&to=" + moment(to).unix() * 1000, (json) => {
      if (json !== undefined && json.length !== 0) {
        this.props.onPrint(json.massages);
        setTimeout(() => window.print(), 5);
        setTimeout(() => this.props.onPrint(null), 10);
      }
      this.toggleModal();
    });
  }

  changeCheck = (id) => {
    this.setState({checkedRadio: id});
  }

  changeFilter = (event) => {
    this.setState({filter: event.target.value});
  }

  changeFrom = (date) => {
    if (typeof date === 'string'
      || date.isAfter(this.state.to)) {
      return;
    }
    this.setState({from: date});
  }

  changeTo = (date) => {
    if (typeof date === 'string'
      || date.isBefore(this.state.from)) {
      return;
    }
    this.setState({to: date});
  }

  handleModalKeyPress = (event) => {
    if (event.charCode === 13 && document.activeElement === ReactDOM.findDOMNode(this.modalDialog)) {
      this.printMassages();
    }
  }

  handleInputKeyPress = (event) => {
    if (event.key === 'Enter') {
      this.printMassages();
    }
  }

  toggleModal = () => {
    this.setState({active: !this.state.active});
  }

  renderInsides = () => {
    return (
      <div>
        <h2>
          { _t.translate('Print settings') }
        </h2>
        <hr />

        <div className="col-md-12">
          <label>{ _t.translate('Time range') }</label>
          <div style={{ 'marginBottom': '10px'}}>
            {this.radios.map((item, index) => (
              <label key={index} className="radio-inline">
                <input type="radio" onChange={() => this.changeCheck(index)}
                  onKeyPress={this.handleInputKeyPress}
                  checked={this.state.checkedRadio === index}
                />
                { _t.translate(item) }
              </label>
            ))}
          </div>
        </div>

        <div className="col-md-12">
          <div className="form-group">
            <div className="col-md-3">
            <Datetime id="fromInput" value={this.state.from}
              inputProps={{disabled: this.state.checkedRadio !== 4}}
              onChange={this.changeFrom} timeFormat={false} />
            </div>
             <div className="col-md-1 text-center" style={{ 'marginTop': '6px' }}>
              <label htmlFor="toInput">{ "–" }</label>
            </div>
            <div className="col-md-3">
            <Datetime id="toInput" value={this.state.to}
              inputProps={{disabled: this.state.checkedRadio !== 4}}
              onChange={this.changeTo} timeFormat={false} />
            </div>
          </div>
        </div>

        <div className="form-group col-md-12" style={{ 'marginTop': '10px'}}>
          <label htmlFor="filterInput">{ _t.translate('Filtering') }</label>
          <input id="filterInput" value={this.state.filter} className="form-control"
            onChange={this.changeFilter} type="text" maxLength="128"
            onFocus={Util.moveCursorToEnd} onKeyPress={this.handleInputKeyPress}
            placeholder={ _t.translate('Masseuse, masseur or client name') } list="masseuses"
          />
          <datalist id="masseuses">
            {this.props.masseuses.map((item) => (
              <option key={item} value={item} />
            ))}
          </datalist>
        </div>

        <ModalActions
          primaryLabel={ _t.translate('Print') }
          onProceed={this.printMassages}
          onClose={this.toggleModal}
          autoFocus={true}
        />
      </div>
    )
  }

  render() {
    return (
      <span style={{ 'marginRight': '5px' }}>
        <BatchButton label={ _t.translate('Print') } onClick={this.toggleModal} />

        {this.state.active ?
          this.props.withPortal ?
            <ModalContainer onClose={this.toggleModal}>
              <ModalDialog onClose={this.toggleModal} width="50%" style={{ 'outline': 'none' }}
                tabIndex="1" onKeyPress={this.handleModalKeyPress}
                ref={(dialog) => {
                  this.modalDialog = dialog;
                }}>
                {this.renderInsides()}
              </ModalDialog>
            </ModalContainer> :
            this.renderInsides() : ''
        }
      </span>
    )
  }
}

PrintModal.propTypes = {
  /** unique Massage masseuses of the given Facility */
  masseuses: PropTypes.arrayOf(PropTypes.string),
  /** ID of the selected Facility */
  facilityId: PropTypes.number,
  /** current date selected in the calendar */
  date: PropTypes.instanceOf(moment).isRequired,
  /** function called on print action */
  onPrint: PropTypes.func.isRequired,
  /** whether ModalContainer should be used; useful for testing to avoid portals */
  withPortal: PropTypes.bool
};

PrintModal.defaultProps = {
  withPortal: true
};

export default PrintModal
