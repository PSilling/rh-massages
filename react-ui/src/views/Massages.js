// react imports
import React, { Component } from 'react';


// component imports
import AssignButton from '../components/AssignButton';
import CancelButton from '../components/CancelButton';
import DeleteButton from '../components/DeleteButton';
import EditButton from '../components/EditButton';
import MassageModal from '../components/MassageModal';

// module imports
import Tabs from 'react-simpletabs';
import 'react-simpletabs/lib/react-simpletabs.css';
import moment from 'moment';

// util imports
import Auth from '../utils/Auth.js';
import _t from '../utils/Translations.js';
import Util from '../utils/Util.js';

var facility1 = {
  name: "Fac",
  massages: [
    {
      id: 1,
      date: new Date(),
      user: {name: "User1"},
      masseuse: {name: "Mas1", id: -1},
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
      masseuse: {name: "Mas2", id: 1},
      facility: {name: "Fac2"}
    }
  ]
}

/**
 * Tabbed facilities with their massage lists.
 */

class FacilitiesList extends Component {

  state = {facilities: [facility1, facility2], index: 1, modalActive: false, editId: -1}

  componentDidMount() {
    //this.getFacilities();
  }

  getFacilities = () => {
    Util.get("/api/facilities", (json) => {
      this.setState({facilities: json});
    });
  }

  assignMassage = (massage) => {
    Util.put("/api/massages/" + massage.id, {
      date: massage.date,
      masseuse: massage.masseuse,
      user: {id: 0},
      facility: massage.facility
    }, this.getFacilities);
  }

  cancelMassage = (massage) => {
    Util.put("/api/massages/" + massage.id, {
      date: massage.date,
      masseuse: massage.masseuse,
      user: {},
      facility: massage.facility
    }, this.getFacilities);
  }

  deleteMassage = (id) => {
    Util.delete("/api/massages/" + id, this.getFacilities);
  }

  onTabChange = (index) => {
    this.setState({index: index});
  }

  toggleModal = (id) => {
    this.setState({modalActive: !this.state.modalActive, editId: id});
  }

  render () {
    return (
      <div>
        <h1>
          { _t.translate('Massages') }
        </h1>
        <Tabs tabActive={this.state.index} onAfterChange={this.onTabChange}>
          {this.state.facilities.map((item) => (
            <Tabs.Panel title={item.name} key={item}>
              <h2>
                {item.name}
              </h2>
              <table className="table table-hover table-responsive">
                <thead>
                  <tr>
                    <th>{ _t.translate('Date') }</th>
                    <th>{ _t.translate('Masseuse') }</th>
                    <th>{ _t.translate('Status') }</th>
                    {Auth.isAdmin() ?
                      <th>
                        <MassageModal
                          active={this.state.modalActive}
                          massage={this.state.editId === -1 ?
                            -1 : this.state.facilities[this.state.index-1].massages[this.state.editId]}
                          facilityName={this.state.facilities[this.state.index-1].name}
                          getCallback={() => {this.getFacilities()}}
                          onToggle={() => {this.toggleModal(-1)}}
                        />
                      </th> : ''
                    }
                  </tr>
                </thead>
                <tbody>
                  {item.massages.map((item, index) => (
                    <tr key={index}>
                      <td>{moment(item.date).format("DD. MM. HH:mm")}</td>
                      <td>{item.masseuse.name}</td>
                      {Util.isEmpty(item.user) ?
                        <td className="success">
                          { _t.translate('Free') }
                          <AssignButton onAssign={() => this.assignMassage(item)} />
                        </td> :
                        <td className="danger">
                          { _t.translate('Full') }
                          <CancelButton onCancel={() => this.cancelMassage(item)} />
                        </td>
                      }
                      {Auth.isAdmin() ?
                        <td width="105px">
                          <span className="pull-right">
                            <span style={{ 'marginRight': '5px' }}>
                              <EditButton onEdit={() => this.toggleModal(index)} />
                            </span>
                            <DeleteButton onDelete={() => this.deleteMassage(item.id)} />
                          </span>
                        </td> : ''
                      }
                    </tr>
                  ))}
                </tbody>
              </table>
            </Tabs.Panel>
          ))}
        </Tabs>
      </div>
    );
  }
}

const Massages = () => (
  <div>
    <FacilitiesList />
  </div>
);

export default Massages
