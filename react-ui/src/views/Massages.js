// react imports
import React, { Component } from 'react';

// component imports
import AssignButton from '../components/buttons/AssignButton';
import CancelButton from '../components/buttons/CancelButton';
import ForceCancelButton from '../components/buttons/ForceCancelButton';
import CalendarButton from '../components/iconbuttons/CalendarButton';
import BatchDeleteButton from '../components/buttons/BatchDeleteButton';
import DeleteButton from '../components/iconbuttons/DeleteButton';
import EditButton from '../components/iconbuttons/EditButton';
import MassageModal from '../components/modals/MassageModal';
import MassageCopyModal from '../components/modals/MassageCopyModal';
import MassageBatchAddModal from '../components/modals/MassageBatchAddModal';
import MassageBatchEditModal from '../components/modals/MassageBatchEditModal';
import Pager from '../components/util/Pager';
import SearchField from '../components/util/SearchField';
import UnauthorizedMessage from '../components/util/UnauthorizedMessage';

// module imports
import Tabs from 'react-simpletabs';
import 'react-simpletabs/lib/react-simpletabs.css';
import '../styles/modules/react-simpletabs.css';
import moment from 'moment';

// util imports
import Auth from '../util/Auth';
import _t from '../util/Translations';
import Util from '../util/Util';

/**
 * Tabbed facilities with their massage lists.
 */

class FacilitiesTabs extends Component {

  state = {facilities: [], massages: [], allMassages: [], masseuses: [], selected: [], index: 1,
            page: 1, editId: -1, massageMinutes: 0,  modalActive: false, copyModalActive: false,
            batchEditModalActive: false, batchAddModalActive: false, search: ""}

  componentDidMount() {
    Util.clearAllIntervals();

    this.getFacilities();

      setInterval(() => {
        if (this.state.modalActive || this.state.copyModalActive || this.state.batchEditModalActive
             || this.state.batchAddModalActive) return;
        this.getMassages(this.state.index-1);
      }, Util.AUTO_REFRESH_TIME);

      setInterval(() => {
        if (this.state.modalActive || this.state.copyModalActive || this.state.batchEditModalActive
             || this.state.batchAddModalActive) return;
        this.searchMassages();
      }, 750);
  }

  getFacilities = () => {
    Util.get(Util.FACILITIES_URL, (json) => {
      json.sort(function(a, b) {
        if (a.name < b.name) return -1;
        if (a.name > b.name) return 1;
        return 0;
      });
      this.setState({facilities: json});
      this.getMassages(this.state.index-1);
    });
  }

  getMassages = (index) => {
    if (this.state.facilities.length > 0) {
      Util.get(Util.FACILITIES_URL + this.state.facilities[index].id +
        "/massages", (json) => {
        json.sort(function(a, b) {
          return a.date - b.date;
        });

        for (var i = 0; i < json.length; i++) {
          if (moment(json[i].ending).isBefore(moment())
            || (moment(json[i].date).isBefore(moment()) && json[i].client === null)) {
            json.splice(i, 1);
            i--;
          }
        }

        if (!Util.arraysEqual(this.state.allMassages, json)) {
          this.setState({allMassages: json});
          this.updateSelected();
          this.findUniqueMasseuses();
          this.updateMassageCap();
        }
      });
    }
  }

  assignMassage = (massage) => {
    Util.put(Util.MASSAGES_URL + massage.id, [{
      date: massage.date,
      ending: massage.ending,
      masseuse: massage.masseuse,
      client: Auth.getSub(),
      contact: Auth.getContact(),
      facility: massage.facility
    }], () => this.getMassages(this.state.index-1));
  }

  assignMassageWithEvent = (massage) => {
    Util.put(Util.MASSAGES_URL + massage.id, [{
      date: massage.date,
      ending: massage.ending,
      masseuse: massage.masseuse,
      client: Auth.getSub(),
      contact: Auth.getContact(),
      facility: massage.facility
    }], () => {
      Util.addToCalendar(massage);
      this.getMassages(this.state.index-1);
    });
  }

  cancelMassage = (massage) => {
    Util.put(Util.MASSAGES_URL + massage.id, [{
      date: massage.date,
      ending: massage.ending,
      masseuse: massage.masseuse,
      client: null,
      contact: null,
      facility: massage.facility
    }], () => this.getMassages(this.state.index-1));
  }

  deleteMassage = (id) => {
    Util.delete(Util.MASSAGES_URL + id, () => this.getMassages(this.state.index-1));
  }

  deleteSelectedMassages = () => {
    var idString = "";

    for (var i = 0; i < this.state.selected.length; i++) {
      idString += this.state.selected[i].id + "&";
    }

    Util.delete(Util.MASSAGES_URL + idString, () => {
      this.setState({selected: []});
      this.getMassages(this.state.index-1);
    });
  }

  findUniqueMasseuses = () => {
    var masseuses = [];

    for (var i = 0; i < this.state.allMassages.length; i++) {
      if (masseuses.indexOf(this.state.allMassages[i].masseuse) === -1) {
        masseuses.push(this.state.allMassages[i].masseuse);
      }
    }
    this.setState({masseuses: masseuses});
  }

  findInArrayById = (array, id) => {
    for (var i = 0; i < array.length; i++) {
        if (array[i].id === id) {
            return i;
        }
    }
    return -1;
  }

  handleMassageSelect = (event, massage) => {
    var selected = this.state.selected;
    if (event.target.checked) {
      selected.push(massage);
    } else {
      selected.splice(this.findInArrayById(selected, massage.id), 1);
    }
    this.setState({selected: selected});
  }

  handleSelectAll = (event) => {
    if (event.target.checked) {
      var selected = [];
      for (var i = 0; i < this.state.massages
        .slice(0, this.state.page * Util.MASSAGES_PER_PAGE).length; i++) {
        selected.push(this.state.massages[i]);
      }
      this.setState({selected: selected});
    } else {
      this.setState({selected: []});
    }
  }

  updateSelected = () => {
    var selected = this.state.selected;
    for (var i = 0; i < selected.length; i++) {
      if (this.findInArrayById(this.state.massages, selected[i].id) === -1) {
        selected.splice(selected[i], 1);
      }
    }
    this.setState({selected: selected});
  }

  updateMassageCap = () => {
    var totalMassageMinutes = 0;
    for (var i = 0; i < this.state.allMassages.length; i++) {
      if (this.state.allMassages[i].client === Auth.getSub()) {
        totalMassageMinutes += moment(this.state.allMassages[i].ending).diff(moment(this.state.allMassages[i].date), 'minutes');
      }
    }
    this.setState({massageMinutes: totalMassageMinutes});
  }

  changeSearch = (event) => {
    this.setState({search: event.target.value});
  }

  searchMassages = () => {
    var massages = [];
    var searchString = "";
    for (var i = 0; i < this.state.allMassages.length; i++) {
      searchString = (moment(this.state.allMassages[i].date).format("dd DD. MM. HH:mm")
                      + this.state.allMassages[i].masseuse).toLowerCase();
      if (searchString.includes(this.state.search.toLowerCase())) {
        massages.push(this.state.allMassages[i]);
      }
    }
    if (!Util.arraysEqual(this.state.massages, massages)) {
      this.setState({massages: massages, page: 1, selected: []});
    }
  }

  changePage = (page) => {
    this.setState({page: page});
  }

  onTabChange = (index) => {
    this.getMassages(index-1);

    this.setState({index: index, page: 1});
  }

  toggleModal = (id) => {
    this.setState({modalActive: !this.state.modalActive, editId: id});
  }

  toggleCopyModal = (deselect = false) => {
    if (deselect) {
      this.setState({selected: []});
    }
    this.setState({copyModalActive: !this.state.copyModalActive});
  }

  toggleBatchEditModal = (deselect = false) => {
    if (deselect) {
      this.setState({selected: []});
    }
    this.setState({batchEditModalActive: !this.state.batchEditModalActive});
  }

  toggleBatchAddModal = (deselect = false) => {
    if (deselect) {
      this.setState({selected: []});
    }
    this.setState({batchAddModalActive: !this.state.batchAddModalActive});
  }

  render () {
    if (!Auth.isAuthenticated()) {
      return(
        <UnauthorizedMessage title={ _t.translate('Massages') } />
      );
    }

    return (
      <div>
        {this.state.facilities.length > 0 ?
          <h1>
            { _t.translate('Massages in ') + this.state.facilities[this.state.index-1].name}
          </h1> : _t.translate('Massages')
        }
          {this.state.facilities.length > 0 ?
          <Tabs tabActive={this.state.index} onAfterChange={this.onTabChange}>
            {this.state.facilities.map((item) => (
              <Tabs.Panel title={item.name} key={item}>
                <SearchField value={this.state.search} onChange={this.changeSearch} />
                <br />
                {Auth.isAdmin() ?
                  <div className="pull-right">
                    <MassageBatchAddModal
                      active={this.state.batchAddModalActive}
                      masseuses={this.state.masseuses}
                      facilityId={item.id}
                      getCallback={() => {this.getMassages(this.state.index-1)}}
                      onToggle={(deselect) => {this.toggleBatchAddModal(deselect)}}
                    />
                    <MassageCopyModal
                      active={this.state.copyModalActive}
                      disabled={this.state.selected.length > 0 ? false : true}
                      massages={this.state.selected}
                      getCallback={() => {this.getMassages(this.state.index-1)}}
                      onToggle={(deselect) => {this.toggleCopyModal(deselect)}}
                    />
                    <MassageBatchEditModal
                      active={this.state.batchEditModalActive}
                      disabled={this.state.selected.length > 0 ? false : true}
                      massages={this.state.selected}
                      masseuses={this.state.masseuses}
                      getCallback={() => {this.getMassages(this.state.index-1)}}
                      onToggle={(deselect) => {this.toggleBatchEditModal(deselect)}}
                    />
                    <BatchDeleteButton onDelete={() => this.deleteSelectedMassages()}
                      label={ _t.translate('Delete selected') }
                      disabled={this.state.selected.length > 0 ? false : true} />
                  </div> : ''
                }
                <table className="table table-hover table-responsive table-striped table-condensed">
                  <thead>
                    <tr>
                      {Auth.isAdmin() ?
                        <th width="40px" className="text-center">
                          <input type="checkbox" onChange={this.handleSelectAll}
                            checked={this.state.massages
                              .slice(0, this.state.page * Util.MASSAGES_PER_PAGE).length === this.state.selected.length
                              && this.state.selected.length > 0 ? true : false} />
                        </th> : <th className="hidden"></th>
                      }
                      <th>{ _t.translate('Date') }</th>
                      <th>{ _t.translate('Time') }</th>
                      <th>{ _t.translate('Masseur/Masseuse') }</th>
                      <th width="40%">{ _t.translate('Status') }</th>
                      <th>{ _t.translate('Event') }</th>
                      {Auth.isAdmin() ?
                        <th>
                          <MassageModal
                            active={this.state.modalActive}
                            massage={this.state.editId === -1 ? -1 : this.state.massages[this.state.editId]}
                            masseuses={this.state.masseuses}
                            facilityId={this.state.facilities[this.state.index-1].id}
                            getCallback={() => {this.getMassages(this.state.index-1)}}
                            onToggle={() => {this.toggleModal(-1)}}
                          />
                        </th> : <th className="hidden"></th>
                      }
                    </tr>
                  </thead>
                  {this.state.massages.length > 0 ?
                    <tbody>
                      {this.state.massages.slice(0, this.state.page * Util.MASSAGES_PER_PAGE)
                        .map((item, index) => (
                        <tr key={index}>
                          {Auth.isAdmin() ?
                            <td width="40px" className="text-center">
                              <input type="checkbox" onChange={(event) => this.handleMassageSelect(event, item)}
                                checked={this.findInArrayById(this.state.selected, item.id) === -1 ? false : true} />
                            </td> : <td className="hidden"></td>
                          }
                          <td>{moment(item.date).format("dd DD. MM.")}</td>
                          <td>{moment(item.date).format("HH:mm") + "–" + moment(item.ending).format("HH:mm")}</td>
                          <td>{item.masseuse}</td>
                          {Util.isEmpty(item.client) ?
                            <td className="success">
                              { _t.translate('Free') }
                              <AssignButton onAssign={() => this.assignMassage(item)}
                                onAssignWithEvent={() => this.assignMassageWithEvent(item)}
                                disabled={(this.state.massageMinutes
                                  + moment(item.ending).diff(moment(item.date), 'minutes')) > Util.MAX_MASSAGE_MINS ? true : false}
                              />
                            </td> :
                            <td className={ Auth.getSub() === item.client ? "warning" : "danger" }>
                              { Auth.getSub() === item.client ? _t.translate('Assigned') :
                                Util.isEmpty(item.contact) ? _t.translate('Full') : _t.translate('Full') + " – " + item.contact}
                              { Auth.getSub() === item.client ? <CancelButton onCancel={() => this.cancelMassage(item)}
                                disabled={(moment(item.date).diff(moment(), 'minutes') <= Util.CANCELLATION_LIMIT) && !Auth.isAdmin() ? true : false} /> : '' }
                              { Auth.isAdmin() && Auth.getSub() !== item.client ? <ForceCancelButton onCancel={() => this.cancelMassage(item)} /> : '' }
                            </td>
                          }
                          { Auth.getSub() === item.client ?
                            <td width="55px">
                              <span>
                                <CalendarButton disabled={false} onAdd={() => Util.addToCalendar(item)} />
                              </span>
                            </td> :
                            <td width="55px">
                              <span>
                                <CalendarButton disabled={true} onAdd={() => Util.addToCalendar(item)} />
                              </span>
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
                            </td> : <td className="hidden"></td>
                          }
                        </tr>
                      ))}
                    </tbody> :
                    <tbody>
                      <tr>
                        <th colSpan="7">
                          { _t.translate('None') }
                        </th>
                      </tr>
                    </tbody>
                  }
                </table>
                {this.state.massages.length > 0 ?
                  <Pager massages={this.state.massages.length} page={this.state.page}
                    changeHandler={(page) => this.changePage(page)} /> : ''
                }
              </Tabs.Panel>
            ))}
          </Tabs> :
          <h3>
            { _t.translate('None') }
          </h3>
        }
      </div>
    );
  }
}

const Massages = () => (
  <div>
    <FacilitiesTabs />
  </div>
);

export default Massages
