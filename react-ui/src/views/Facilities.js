// react imports
import React, { Component } from 'react';


// component imports
import DeleteButton from '../components/iconbuttons/DeleteButton';
import EditButton from '../components/iconbuttons/EditButton';
import FacilityModal from '../components/modals/FacilityModal';
import UnauthorizedMessage from '../components/util/UnauthorizedMessage';

// util imports
import Auth from '../util/Auth';
import _t from '../util/Translations';
import Util from '../util/Util';

/**
 * Facility management
 */
class FacilitiesList extends Component {

  state = {facilities: [], modalActive: false, editId: -1}

  componentDidMount() {
    Util.clearAllIntervals();

    this.getFacilities();

    setInterval(() => {
      if (this.state.modalActive) return;
      this.getFacilities();
    }, Util.AUTO_REFRESH_TIME * 30);
  }

  getFacilities = () => {
    Util.get(Util.FACILITIES_URL, (json) => {
      json.sort(function(a, b) {
        if (a.name < b.name) return -1;
        if (a.name > b.name) return 1;
        return 0;
      });
      if (!Util.arraysEqual(this.state.facilities, json)) {
        this.setState({facilities: json});
      }
    });
  }

  deleteFacility = (id) => {
    Util.delete(Util.FACILITIES_URL + id, this.getFacilities);
  }

  toggleModal = (id) => {
    this.setState({modalActive: !this.state.modalActive, editId: id});
  }

  render () {
    if (!Auth.isAdmin()) {
      return(
        <UnauthorizedMessage title={ _t.translate('Facilities') } />
      );
    }

    return (
      <div>
        <h1>
          { _t.translate('Facilities') }
        </h1>
        <hr />
        <table className="table table-hover table-responsive table-striped">
          <thead>
            <tr>
              <th>{ _t.translate('Name') }</th>
              <th>
                <FacilityModal
                  active={this.state.modalActive}
                  facility={this.state.editId === -1 ?
                    -1 : this.state.facilities[this.state.editId]}
                  getCallback={() => {this.getFacilities()}}
                  onToggle={() => {this.toggleModal(-1)}}
                />
              </th>
            </tr>
          </thead>
          {this.state.facilities.length > 0 ?
            <tbody>
              {this.state.facilities.map((item, index) => (
                <tr key={index}>
                  <td>{item.name}</td>
                  <td width="105px">
                    <span className="pull-right">
                      <span style={{ 'marginRight': '5px' }}>
                        <EditButton onEdit={() => this.toggleModal(index)} />
                      </span>
                      <DeleteButton onDelete={() => this.deleteFacility(item.id)} />
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
            : <tbody>
              <tr>
                <th colSpan="2">
                  { _t.translate('None') }
                </th>
              </tr>
            </tbody>
          }
        </table>
      </div>
    );
  }
}

const Facilities = () => (
  <div>
    <FacilitiesList />
  </div>
);

export default Facilities
