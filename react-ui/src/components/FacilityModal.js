// react imports
import React, { Component } from 'react';


// component imports
import AddButton from './AddButton';
import ModalActions from './ModalActions';

// module imports
import {ModalContainer, ModalDialog} from 'react-modal-dialog';

// util imports
import _t from '../utils/Translations.js';
import Util from '../utils/Util.js';

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
    Util.put(Util.FACILITIES_URL + this.props.facility.id, {
      name: this.state.name
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
                {this.props.facility === -1 ?
                  _t.translate('New Facility') : _t.translate('Edit Facility')
                }
              </h2>
              <hr />
              <div className="form-group">
                <label>{ _t.translate('Name') }</label>
                <input value={this.state.name} onChange={this.changeName}
                  className="form-control" />
              </div>
              {this.props.facility === -1 ?
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

export default FacilityModal
