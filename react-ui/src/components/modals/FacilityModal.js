// react imports
import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';

// component imports
import AddButton from '../iconbuttons/AddButton';
import ModalActions from '../buttons/ModalActions';

// module imports
import {ModalContainer, ModalDialog} from 'react-modal-dialog';

// util imports
import _t from '../../util/Translations';
import Util from '../../util/Util';

/**
 * Input Modal for Facility management. Allows the change of Facility name.
 * Based on given values can be used for both creating and editing of Facilities.
 */
class FacilityModal extends Component {

  state = {name: ""}

  componentWillReceiveProps(nextProps) {
    if (this.props === nextProps) return;

    this.setState({
      name: (nextProps.facility === null) ? "" : nextProps.facility.name
    });
  }

  changeName = (event) => {
    this.setState({name: event.target.value});
  }

  addFacility = () => {
    if (Util.isEmpty(this.state.name)) {
      Util.notify("error", "", _t.translate('Name is required!'));
      return;
    }
    Util.post(Util.FACILITIES_URL, {
      name: this.state.name
    }, () => {
      this.props.onToggle();
      this.props.getCallback();
    });
  }

  editFacility = () => {
    if (Util.isEmpty(this.state.name)) {
      Util.notify("error", "", _t.translate('Name is required!'));
      return;
    }
    Util.put(Util.FACILITIES_URL + this.props.facility.id, {
      name: this.state.name
    }, () => {
      this.props.onToggle();
      this.props.getCallback();
    });
  }

  handleModalKeyPress = (event) => {
    if (event.charCode === 13 && document.activeElement === ReactDOM.findDOMNode(this.modalDialog)) {
      if (this.props.facility === null) {
        this.addFacility();
      } else {
        this.editFacility();
      }
    }
  }

  handleInputKeyPress = (event) => {
    if (event.charCode === 13) {
      if (this.props.facility === null) {
        this.addFacility();
      } else {
        this.editFacility();
      }
    }
  }

  render() {
    return (
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
                {this.props.facility === null ?
                  _t.translate('New Facility') : _t.translate('Edit Facility')
                }
              </h2>
              <hr />
              <div className="form-group col-md-12">
                <label htmlFor="facilityInput">{ _t.translate('Name') }</label>
                <input id="facilityInput" value={this.state.name} onChange={this.changeName}
                  className="form-control" autoFocus onFocus={Util.moveCursorToEnd}
                  onKeyPress={this.handleInputKeyPress} type="text" maxLength="64"
                  placeholder={ _t.translate('Name') }
                />
              </div>
              {this.props.facility === null ?
                <ModalActions
                  primaryLabel={ _t.translate('Add') }
                  onProceed={this.addFacility}
                  onClose={this.props.onToggle}
                /> :
                <ModalActions
                  primaryLabel={ _t.translate('Edit') }
                  onProceed={this.editFacility}
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

FacilityModal.propTypes = {
  /** whether the dialog should be shown */
  active: PropTypes.bool.isRequired,
  /** Facility to be possibly edited or null when adding */
  facility: PropTypes.object,
  /** callback function for Facility list update */
  getCallback: PropTypes.func.isRequired,
  /** function called on modal toggle */
  onToggle: PropTypes.func.isRequired
}

export default FacilityModal
