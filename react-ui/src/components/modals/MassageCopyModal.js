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
 * Modal dialog that enables generation of Massage copies at a selected time interval.
 */
class MassageCopyModal extends Component {

  state = {count: 1, step: 7}

  changeCount = (event) => {
    if (Util.isEmpty(event.target.value) || parseInt(event.target.value, 10) < 1
        || parseInt(event.target.value, 10) > 54) {
      return;
    }
    this.setState({count: event.target.value});
  }

  changeStep = (event) => {
    if (Util.isEmpty(event.target.value) || parseInt(event.target.value, 10) < 1
        || parseInt(event.target.value, 10) > 365) {
      return;
    }
    this.setState({step: event.target.value});
  }

  /**
   * Creates all generated copies of the given Massages.
   */
  addMassages = () => {
    var postArray = [];
    for (var i = 1; i <= parseInt(this.state.count, 10); i++) {
      for (var j = 0; j < this.props.massages.length; j++) {
        postArray.push({
          date: moment(this.props.massages[j].date).add(this.state.step * i, 'days').toDate(),
          ending: moment(this.props.massages[j].ending).add(this.state.step * i, 'days').toDate(),
          masseuse: this.props.massages[j].masseuse,
          client: null,
          facility: {id: this.props.massages[j].facility.id}
        });
      }
    }
    Util.post(Util.MASSAGES_URL, postArray, () => {
      this.props.getCallback();
      this.props.onToggle(true);
    });
  }

  handleModalKeyPress = (event) => {
    if (event.charCode === 13 && document.activeElement === ReactDOM.findDOMNode(this.modalDialog)) {
      this.addMassages();
    }
  }

  handleInputKeyPress = (event) => {
    if (event.key === 'Enter') {
      this.addMassages();
    }
  }

  render() {
    return (
      <span style={{ 'marginRight': '5px' }}>
        <BatchButton onClick={() => this.props.onToggle(false)} disabled={this.props.disabled}
          label={ _t.translate('Copy selected') } />

        {this.props.active ?
          <ModalContainer onClose={() => this.props.onToggle(false)}>
            <ModalDialog onClose={() => this.props.onToggle(false)} width="50%" style={{ 'outline': 'none' }}
              tabIndex="1" onKeyPress={this.handleModalKeyPress}
              ref={(dialog) => {
                this.modalDialog = dialog;
              }}>
              <h2>
                { _t.translate('Copy Massages') }
              </h2>
              <hr />
              <div className="form-group col-md-12">
                <label htmlFor="valueInput">{ _t.translate('Number of repetitions') }</label>
                <div className="row">
                  <div className="col-md-4">
                    <input id="valueInput" value={this.state.count} onChange={this.changeCount}
                      className="form-control" onKeyPress={this.handleInputKeyPress}
                      autoFocus onFocus={Util.moveCursorToEnd} type="number" min="1"
                      max="54" placeholder={ _t.translate('Number of repetitions') }
                    />
                  </div>
                </div>
              </div>

              <div className="form-group col-md-12">
                <label htmlFor="stepInput">{ _t.translate('Day step per repetition') }</label>
                <div className="row">
                  <div className="col-md-4">
                    <input id="stepInput" value={this.state.step} onChange={this.changeStep}
                      className="form-control" onKeyPress={this.handleInputKeyPress} onFocus={Util.moveCursorToEnd}
                      type="number" min="1" max="365" placeholder={ _t.translate('Day step per repetition') }
                    />
                  </div>
                </div>
              </div>
              <ModalActions
                primaryLabel={ _t.translate('Copy') }
                onProceed={this.addMassages}
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

MassageCopyModal.propTypes = {
  /** whether the dialog should be shown */
  active: PropTypes.bool,
  /** whether the trigger button should be disabled or not */
  disabled: PropTypes.bool,
  /** Massages to be copied */
  massages: PropTypes.arrayOf(PropTypes.object).isRequired,
  /** callback function for Massage list update */
  getCallback: PropTypes.func.isRequired,
  /** function called on modal toggle */
  onToggle: PropTypes.func.isRequired
};

export default MassageCopyModal
