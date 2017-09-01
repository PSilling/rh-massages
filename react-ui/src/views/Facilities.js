// react imports
import React, { Component } from 'react';


// component imports
import DeleteButton from '../components/DeleteButton';
import EditButton from '../components/EditButton';
import FacilityModal from '../components/FacilityModal';

// util imports
import _t from '../utils/Translations.js';
import Util from '../utils/Util.js';

var facility1 = {
  name: "Fac",
  massages: [
    {
      id: 1,
      date: new Date(),
      user: {name: "User1"},
      masseuse: "Mas1",
      facility: {name: "Fac"}
    }
  ]
}

var facility2 = {
  name: "Fac2",
  massages: [
    {
      id: 2,
      date: new Date(0),
      user: null,
      masseuse: "Mas2",
      facility: {name: "Fac2"}
    }
  ]
}

/**
 * Tabbed facilities with their massage lists.
 */

class FacilitiesList extends Component {

  state = {facilities: [facility1, facility2], modalActive: false, editId: -1}

  componentDidMount() {
    //this.getFacilities();
  }

  getFacilities = () => {
    Util.get("/api/facilities", (json) => {
      this.setState({facilities: json});
    });
  }

  deleteFacility = (name) => {
    Util.delete("/api/facilities/" + name, this.getFacilities);
  }

  toggleModal = (id) => {
    this.setState({modalActive: !this.state.modalActive, editId: id});
  }

  render () {
    return (
      <div>
        <h1>
          { _t.translate('Facilities') }
        </h1>
        <hr />
        <table className="table table-hover table-responsive">
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
          <tbody>
            {this.state.facilities.map((item, index) => (
              <tr key={index}>
                <td>{item.name}</td>
                <td width="105px">
                  <span className="pull-right">
                    <span style={{ 'marginRight': '5px' }}>
                      <EditButton onEdit={() => this.toggleModal(index)} />
                    </span>
                    <DeleteButton onDelete={() => this.deleteFacility(item.name)} />
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
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
