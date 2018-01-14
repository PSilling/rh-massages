// react imports
import React, { Component } from 'react';

// component imports
import BatchDeleteButton from '../components/buttons/BatchDeleteButton';
import MassageModal from '../components/modals/MassageModal';
import MassageRow from '../components/rows/MassageRow';
import MassageCopyModal from '../components/modals/MassageCopyModal';
import MassageBatchAddModal from '../components/modals/MassageBatchAddModal';
import MassageBatchEditModal from '../components/modals/MassageBatchEditModal';
import Pager from '../components/navs/Pager';
import MassageFilter from '../components/util/MassageFilter';
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
            batchEditModalActive: false, batchAddModalActive: false,
            search: "", freeOnly: false, from: moment().format("YYYY-MM-DD"),
            to: moment().add(1, 'months').format("YYYY-MM-DD"), perPage: 12, pages: 1}

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

  getMassages = () => {
    if (this.state.facilities.length > 0) {
      Util.get(Util.FACILITIES_URL + this.state.facilities[this.state.index].id
        + "/massages?search=" + this.state.search
        + "&free=" + this.state.freeOnly
        + "&from=" + moment(this.state.from).unix() * 1000
        + "&to=" + moment(this.state.to).add(1, 'days').unix() * 1000
        + "&page=" + this.state.page
        + "&perPage=" + this.state.perPage, (json) => {
          this.updateMassages(json.massages, json.totalCount, (json.clientTime / 60000));
      });
    }
  }

  updateMassages = (massages, count, minutes) => {
    var masseuses = [];
    for (var i = 0; i < massages.length; i++) {
      if (masseuses.indexOf(massages[i].masseuse) === -1) {
        masseuses.push(massages[i].masseuse);
      }
    }

    let selected = this.state.selected;
    for (i = 0; i < selected.length; i++) {
      if (this.findInArrayById(massages, selected[i].id) === -1) {
        selected.splice(i, 1);
        i--;
      }
    }

    let pages = Math.ceil(count / this.state.perPage);
    if (pages < 1) {
      pages = 1;
    }
    this.setState({massages: massages, masseuses: masseuses,
      massageMinutes: minutes, selected: selected, pages: pages,
      page: this.state.page > pages ? pages : this.state.page
    });
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
      for (var i = 0; i < this.state.massages.length; i++) {
        selected.push(this.state.massages[i]);
      }
    }
    this.setState({selected: selected});
  }

  changeSearch = (event) => {
    this.setState({search: event.target.value, page: 1});
  }

  changeFreeOnly = (event) => {
    this.setState({freeOnly: event.target.checked});
    setTimeout(() => this.getMassages(), 3);
  }

  changePerPage = (event) => {
    if (Util.isEmpty(event.target.value) || parseInt(event.target.value, 10) < 5
        || parseInt(event.target.value, 10) > 55) {
      return;
    }
    this.setState({perPage: parseInt(event.target.value, 10)});
  }

  changeFrom = (event) => {
    if (Util.isEmpty(event.target.value)
      || moment(event.target.value).isAfter(moment(this.state.to))) {
      return;
    }
    this.setState({from: event.target.value});
  }

  changeTo = (event) => {
    if (Util.isEmpty(event.target.value)
      || moment(event.target.value).isBefore(moment(this.state.from))) {
      return;
    }
    this.setState({to: event.target.value});
  }

  changePage = (page) => {
    this.setState({page: page, selected: []});
    setTimeout(() => this.getMassages(), 3);
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
            <MassageFilter checked={this.state.freeOnly} onCheck={this.changeFreeOnly}
              value={this.state.search} onSearchChange={this.changeSearch}
              from={this.state.from} onFromChange={this.changeFrom}
              to={this.state.to} onToChange={this.changeTo} />
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
                  disabled={this.state.selected.length === 0}
                  massages={this.state.selected}
                  getCallback={this.getMassages}
                  onToggle={(deselect) => this.toggleCopyModal(deselect)}
                />
                <MassageBatchEditModal
                  active={this.state.batchEditModalActive}
                  disabled={this.state.selected.length === 0}
                  massages={this.state.selected}
                  masseuses={this.state.masseuses}
                  getCallback={this.getMassages}
                  onToggle={(deselect) => this.toggleBatchEditModal(deselect)}
                />
                <BatchDeleteButton onDelete={this.deleteSelectedMassages}
                  label={ _t.translate('Delete selected') }
                  disabled={this.state.selected.length === 0} />
              </div> : ''
            }
            <table className="table table-hover table-responsive table-striped table-condensed">
              <thead>
                <tr>
                  {Auth.isAdmin() ?
                    <th width="40px" className="text-center">
                      <input type="checkbox" onChange={this.handleSelectAll}
                        checked={this.state.massages.length === this.state.selected.length
                          && this.state.selected.length > 0} />
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
                  {this.state.massages.map((item, index) => (
                    <MassageRow key={item.id} massage={item} checked={this.findInArrayById(this.state.selected, item.id) !== -1}
                      assignDisabled={(this.state.massageMinutes + moment(item.ending)
                        .diff(moment(item.date), 'minutes')) > Util.MAX_MASSAGE_MINS}
                      search={this.state.search}
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
            {this.state.pages > 0 ?
              <Pager pages={this.state.pages} perPage={this.state.perPage} page={this.state.page}
                onPerPageChange={this.changePerPage} onPageChange={(page) => this.changePage(page)} /> : ''
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
