// react imports
import React, { Component } from 'react';
import ReactDOM from 'react-dom';


// component imports
import AddButton from '../iconbuttons/AddButton';
import ModalActions from '../buttons/ModalActions';

// module imports
import {ModalContainer, ModalDialog} from 'react-modal-dialog';

// util imports
import _t from '../../util/Translations';
import Util from '../../util/Util';

class FacilityModal extends Component {

  state = {name: ""}

  /**
   * Sets default input values on props change.
   */
  componentWillReceiveProps(nextProps) {
    if(this.props === nextProps) return;

    this.setState({
      name: (nextProps.facility === -1) ? "" : nextProps.facility.name
    });
  }

  changeName = (event) => {
    this.setState({name: event.target.value});
  }

  /**
   * Handles the post request.
   */
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

  /**
   * Handles the put request.
   */
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
      if (this.props.facility === -1) {
        this.addFacility();
      } else {
        this.editFacility();
      }
    }
  }

  handleInputKeyPress = (event) => {
    if (event.charCode === 13) {
      if (this.props.facility === -1) {
        this.addFacility();
      } else {
        this.editFacility();
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
                {this.props.facility === -1 ?
                  _t.translate('New Facility') : _t.translate('Edit Facility')
                }
              </h2>
              <hr />
              <form>
                <div className="form-group col-md-12">
                  <label>{ _t.translate('Name') }</label>
                  <input value={this.state.name} onChange={this.changeName}
                    className="form-control" autoFocus onFocus={this.moveCursorToEnd}
                    onKeyPress={this.handleInputKeyPress} type="text" maxLength="64"
                    placeholder={ _t.translate('Name') }
                  />
                </div>
              </form>
              {this.props.facility === -1 ?
                <ModalActions
                  primaryLabel={ _t.translate('Add') }
                  onProceed={this.addFacility}
                  onClose={this.props.onToggle}
                  autoFocus={false}
                /> :
                <ModalActions
                  primaryLabel={ _t.translate('Edit') }
                  onProceed={this.editFacility}
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

export default FacilityModal
