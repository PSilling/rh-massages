// react imports
import React, { Component } from 'react';

// component imports
import BatchDeleteButton from '../components/buttons/BatchDeleteButton';
import MassageModal from '../components/modals/MassageModal';
import MassageRow from '../components/rows/MassageRow';
import MassageCopyModal from '../components/modals/MassageCopyModal';
import MassageBatchAddModal from '../components/modals/MassageBatchAddModal';
import MassageBatchEditModal from '../components/modals/MassageBatchEditModal';
import Pager from '../components/util/Pager';
import SearchField from '../components/util/SearchField';
import Tab from '../components/navs/Tab';
import UnauthorizedMessage from '../components/util/UnauthorizedMessage';

// module imports
import moment from 'moment';

// util imports
import Auth from '../util/Auth';
import _t from '../util/Translations';
import Util from '../util/Util';

/**
 * Tabbed facilities with their massage lists.
 */
class FacilitiesTabs extends Component {

  state = {facilities: [], massages: [], masseuses: [], selected: [], index: 0, page: 1,
            editId: -1, massageMinutes: 0,  modalActive: false, copyModalActive: false,
            batchEditModalActive: false, batchAddModalActive: false, search: ""}

  componentDidMount() {
    Util.clearAllIntervals();

    this.getFacilities();
    setInterval(() => {
      if (this.state.modalActive || this.state.copyModalActive || this.state.batchEditModalActive
           || this.state.batchAddModalActive) return;
      this.getMassages();
    }, Util.AUTO_REFRESH_TIME);
  }

  getFacilities = () => {
    Util.get(Util.FACILITIES_URL, (json) => {
      this.setState({facilities: json});
      this.getMassages();
    });
  }

  getMassages = (unlimited = false) => {
    if (this.state.facilities.length > 0) {
      Util.get(Util.FACILITIES_URL + this.state.facilities[this.state.index].id
        + "/massages?search=" + this.state.search
        + "&limit=" + (unlimited ? -1 : ((this.state.page * Util.MASSAGES_PER_PAGE) + 1)), (json) => {
          this.updateMassages(json, unlimited);
      });
    }
  }

  updateMassages = (massages, unlimited) => {
    var masseuses = [];

    for (var i = 0; i < massages.length; i++) {
      if (masseuses.indexOf(massages[i].masseuse) === -1) {
        masseuses.push(massages[i].masseuse);
      }
    }

    Util.get(Util.MASSAGES_URL + "client/time", (json) => {
        this.setState({massageMinutes: (json / 60000)});
    });

    let selected = this.state.selected;
    for (i = 0; i < selected.length; i++) {
      if (this.findInArrayById(massages, selected[i].id) === -1) {
        selected.splice(i, 1);
        i--;
      }
    }

    this.setState({massages: massages, selected: selected, masseuses: masseuses});
    let pages = Math.ceil(massages.length / Util.MASSAGES_PER_PAGE);
    if (unlimited) {
      this.setState({page: pages});
    } else if (this.state.page > pages) {
      this.setState({page: pages === 0 ? 1 : pages});
    }
  }

  assignMassage = (massage) => {
    Util.put(Util.MASSAGES_URL + "?ids=" + massage.id, [{
      date: massage.date,
      ending: massage.ending,
      masseuse: massage.masseuse,
      client: Auth.getSub(),
      contact: Auth.getContact(),
      facility: massage.facility
    }], this.getMassages);
  }

  assignMassageWithEvent = (massage) => {
    Util.put(Util.MASSAGES_URL + "?ids=" + massage.id, [{
      date: massage.date,
      ending: massage.ending,
      masseuse: massage.masseuse,
      client: Auth.getSub(),
      contact: Auth.getContact(),
      facility: massage.facility
    }], () => {
      Util.addToCalendar(massage);
      this.getMassages();
    });
  }

  cancelMassage = (massage) => {
    Util.put(Util.MASSAGES_URL + "?ids=" + massage.id, [{
      date: massage.date,
      ending: massage.ending,
      masseuse: massage.masseuse,
      client: null,
      contact: null,
      facility: massage.facility
    }], this.getMassages);
  }

  deleteMassage = (id) => {
    Util.delete(Util.MASSAGES_URL + "?ids=" + id, this.getMassages);
  }

  deleteSelectedMassages = () => {
    var idString = "?";
    for (var i = 0; i < this.state.selected.length; i++) {
      if (idString.length > 2000) {
        break;
      }
      idString += "ids=" + this.state.selected[i].id + "&";
    }
    Util.delete(Util.MASSAGES_URL + idString, () => {
      this.setState({selected: []});
      this.getMassages();
    });
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
    var selected = [];
    if (event.target.checked) {
      for (var i = 0; i < this.state.massages
        .slice(0, this.state.page * Util.MASSAGES_PER_PAGE).length; i++) {
        selected.push(this.state.massages[i]);
      }
    }
    this.setState({selected: selected});
  }

  changeSearch = (event) => {
    this.setState({search: event.target.value});
  }

  changePage = (page) => {
    if (page === -1) {
      this.getMassages(true);
    } else {
      if (page < this.state.page) {
        let selected = this.state.selected,
            position = this.findInArrayById(selected, this.state.massages[page * Util.MASSAGES_PER_PAGE].id);
        if (position !== -1) {
          selected.splice(position, 1);
          this.setState({selected: selected});
        }
      }
      this.setState({page: page});
      this.getMassages();
    }
  }

  changeTabIndex = (index) => {
    this.setState({index: index, page: 1});
    setTimeout(() => this.getMassages(), 3);
  }

  toggleModal = (id) => {
    this.setState({modalActive: !this.state.modalActive, editId: id});
  }

  toggleCopyModal = (deselect) => {
    if (deselect) {
      this.setState({selected: [], copyModalActive: !this.state.copyModalActive});
    } else {
      this.setState({copyModalActive: !this.state.copyModalActive});
    }
  }

  toggleBatchEditModal = (deselect) => {
    if (deselect) {
      this.setState({selected: [], batchEditModalActive: !this.state.batchEditModalActive});
    } else {
      this.setState({batchEditModalActive: !this.state.batchEditModalActive});
    }
  }

  toggleBatchAddModal = (deselect) => {
    if (deselect) {
      this.setState({selected: [], batchAddModalActive: !this.state.batchAddModalActive});
    } else {
      this.setState({batchAddModalActive: !this.state.batchAddModalActive});
    }
  }

  render () {
    if (!Auth.isAuthenticated()) {
      return (
        <UnauthorizedMessage title={ _t.translate('Massages') } />
      );
    }

    return (
      <div>
        {this.state.facilities.length > 0 ?
          <div>
            <h1>
              { _t.translate('Massages in ') + this.state.facilities[this.state.index].name }
            </h1>
            <ul className="nav nav-tabs" style={{ 'marginBottom': '15px' }}>
              {this.state.facilities.map((item, index) => (
                <Tab active={index === this.state.index} label={item.name} key={item.id}
                  onClick={() => this.changeTabIndex(index)} />
              ))}
            </ul>
            <SearchField value={this.state.search} onChange={this.changeSearch} />
            {Auth.isAdmin() ?
              <div className="pull-right">
                <MassageBatchAddModal
                  active={this.state.batchAddModalActive}
                  masseuses={this.state.masseuses}
                  facilityId={this.state.facilities[this.state.index].id}
                  getCallback={this.getMassages}
                  onToggle={(deselect) => this.toggleBatchAddModal(deselect)}
                />
                <MassageCopyModal
                  active={this.state.copyModalActive}
                  disabled={this.state.selected.length <= 0}
                  massages={this.state.selected}
                  getCallback={this.getMassages}
                  onToggle={(deselect) => this.toggleCopyModal(deselect)}
                />
                <MassageBatchEditModal
                  active={this.state.batchEditModalActive}
                  disabled={this.state.selected.length <= 0}
                  massages={this.state.selected}
                  masseuses={this.state.masseuses}
                  getCallback={this.getMassages}
                  onToggle={(deselect) => this.toggleBatchEditModal(deselect)}
                />
                <BatchDeleteButton onDelete={this.deleteSelectedMassages}
                  label={ _t.translate('Delete selected') }
                  disabled={this.state.selected.length <= 0} />
              </div> : ''
            }
            <table className="table table-hover table-responsive table-striped table-condensed">
              <thead>
                <tr>
                  {Auth.isAdmin() ?
                    <th width="40px" className="text-center">
                      <input type="checkbox" onChange={this.handleSelectAll}
                        checked={this.state.massages.slice(0, this.state.page * Util.MASSAGES_PER_PAGE).length
                          === this.state.selected.length && this.state.selected.length > 0} />
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
                        massage={this.state.editId === -1 ? null : this.state.massages[this.state.editId]}
                        masseuses={this.state.masseuses}
                        facilityId={this.state.facilities[this.state.index].id}
                        getCallback={this.getMassages}
                        onToggle={() => this.toggleModal(-1)}
                      />
                    </th> : <th className="hidden"></th>
                  }
                </tr>
              </thead>
              {this.state.massages.length > 0 ?
                <tbody>
                  {this.state.massages.slice(0, this.state.page * Util.MASSAGES_PER_PAGE)
                    .map((item, index) => (
                    <MassageRow key={item.id} massage={item} checked={this.findInArrayById(this.state.selected, item.id) !== -1}
                      assignDisabled={(this.state.massageMinutes + moment(item.ending)
                        .diff(moment(item.date), 'minutes')) > Util.MAX_MASSAGE_MINS}
                      onCheck={(event) => this.handleMassageSelect(event, item)}
                      onAssign={() => this.assignMassage(item)}
                      onEventAssign={() => this.assignMassageWithEvent(item)}
                      onCancel={() => this.cancelMassage(item)}
                      onDelete={() => this.deleteMassage(item.id)}
                      onEdit={() => this.toggleModal(index)}
                    />
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
                onChange={(page) => this.changePage(page)} /> : ''
            }
          </div> :
          <div>
            <h1>
              { _t.translate('Massages') }
            </h1>
            <h3>
              { _t.translate('None') }
            </h3>
          </div>
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
