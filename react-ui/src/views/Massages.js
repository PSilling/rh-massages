// react imports
import React, { Component } from 'react';

// component imports
import BatchDeleteButton from '../components/buttons/BatchDeleteButton';
import CalendarPanel from '../components/panels/CalendarPanel';
import MassageModal from '../components/modals/MassageModal';
import MassageCopyModal from '../components/modals/MassageCopyModal';
import MassageBatchAddModal from '../components/modals/MassageBatchAddModal';
import MassageBatchEditModal from '../components/modals/MassageBatchEditModal';
import PrintModal from '../components/modals/PrintModal';
import MassageFilter from '../components/util/MassageFilter';
import Tab from '../components/navs/Tab';
import UnauthorizedMessage from '../components/util/UnauthorizedMessage';
import '../styles/components/loader.css';

// module imports
import moment from 'moment';

// util imports
import Auth from '../util/Auth';
import _t from '../util/Translations';
import Util from '../util/Util';

/**
 * Main view calendar component for Massage management. Normal users can only view,
 * assign and cancel Massages. Supports batch CRUD operations.
 */
class Massages extends Component {

  state = {facilities: [], masseuses: [], selected: [], index: 0, selectEvents: false,
            editMassage: null, massageMinutes: 0, loading: true,  modalActive: false,
            copyModalActive: false, batchEditModalActive: false, batchAddModalActive: false,
            events: [], search: "", freeOnly: false, printMassages: null, selectedDate: moment(),
            from: moment().startOf('isoWeek').subtract(7, 'days'),
            to: moment().endOf('isoWeek').add(5, 'days')}

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
    if (this.state.facilities !== undefined && this.state.facilities.length > 0) {
      Util.get(Util.FACILITIES_URL + this.state.facilities[this.state.index].id
        + "/massages?search=" + this.state.search
        + "&free=" + this.state.freeOnly
        + "&from=" + moment(this.state.from).unix() * 1000
        + "&to=" + moment(this.state.to).unix() * 1000, (json) => {
        if (json !== undefined && json.massages !== undefined
             && json.clientTime !== undefined) {
          this.updateEvents(json.massages, (json.clientTime / 60000));
        }
      });
    }
  }

  updateEvents = (massages, minutes) => {
    var events = [],
        masseuses = [],
        color;
    for (var i = 0; i < massages.length; i++) {
      if (Util.isEmpty(massages[i].client)) {
        color = "#2fad2f"; // Bootsrap warning color (buttons)
      } else if (Auth.getSub() === massages[i].client.sub) {
        color = "#ee9d2a"; // Bootsrap warning color (buttons)
      } else {
        color = "#d10a14"; // Bootsrap danger color (buttons)
      }
      events.push({massage: massages[i], bgColor: color});

      if (masseuses.indexOf(massages[i].masseuse) === -1) {
        masseuses.push(massages[i].masseuse);
      }
    }

    let selected = this.state.selected;
    for (i = 0; i < selected.length; i++) {
      if (Util.findInArrayById(massages, selected[i].id) === -1) {
        selected.splice(i, 1);
        i--;
      }
    }

    this.setState({events: events, masseuses: masseuses, massageMinutes: minutes,
      selected: selected, loading: false});
  }

  assignMassage = (massage) => {
    Util.put(Util.MASSAGES_URL, [{
      id: massage.id,
      date: massage.date,
      ending: massage.ending,
      masseuse: massage.masseuse,
      client: Auth.getClient(),
      facility: massage.facility
    }], this.getMassages);
  }

  cancelMassage = (massage) => {
    Util.put(Util.MASSAGES_URL, [{
      id: massage.id,
      date: massage.date,
      ending: massage.ending,
      masseuse: massage.masseuse,
      client: null,
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

  handleEventSelect = (event) => {
    if (event === null) {
      this.setState({selected: []});
      return;
    }

    var selected = this.state.selected,
        index = Util.findInArrayById(selected, event.massage.id);
    if (index !== -1) {
      selected.splice(index, 1);
    } else {
      selected.push(event.massage);
    }
    this.setState({selected: selected});
  }

  changeSearch = (event) => {
    this.setState({search: event.target.value});
  }

  changeFreeOnly = (event) => {
    this.setState({freeOnly: event.target.checked, loading: true});
    setTimeout(() => this.getMassages(), 3);
  }

  changeSelectEvents = (event) => {
    this.setState({selected: [], selectEvents: event.target.checked});
  }

  changeTimeRange = (moment, view) => {
    if (view === 'month') {
      this.setState({
        from: moment.clone().startOf('month').subtract(37, 'days'),
        to: moment.clone().endOf('month').add(37, 'days'),
        loading: true, selected: [], selectedDate: moment
      });
    } else {
      this.setState({
        from: moment.clone().startOf('isoWeek').subtract(7, 'days'),
        to: moment.clone().endOf('isoWeek').add(5, 'days'),
        loading: true, selected: [], selectedDate: moment
      });
    }
    setTimeout(() => this.getMassages(), 3);
  }

  changeTabIndex = (index) => {
    this.setState({index: index, loading: true});
    setTimeout(() => this.getMassages(), 3);
  }

  setPrintMassages = (massages) => {
    this.setState({printMassages: massages});
  }

  createPrintRows = () => {
    var rows = [];
    if (this.state.printMassages.length === 0) {
      rows.push(
        <tr key="info">
          <td colSpan="4">{ _t.translate('None') }</td>
        </tr>
      );
    } else {
      for (var i = 0; i < this.state.printMassages.length; i++) {
        rows.push(
          <tr key={i}>
            <td>
              {moment(this.state.printMassages[i].date).format('L')}
            </td>
            <td>
              {moment(this.state.printMassages[i].date).format("HH:mm") + "–" + moment(this.state.printMassages[i].ending).format("HH:mm")}
            </td>
            <td>
              {this.state.printMassages[i].masseuse}
            </td>
            <td>
              { Util.isEmpty(this.state.printMassages[i].client) ? _t.translate('Free') : Util.getContactInfo(this.state.printMassages[i].client)}
            </td>
          </tr>
        );
      }
    }
    return rows;
  }

  toggleModal = (massage) => {
    this.setState({modalActive: !this.state.modalActive, editMassage: massage});
  }

  toggleModalWithTime = (slot) => {
    if (moment(slot.start).isBefore(moment())) {
      Util.notify("warning", _t.translate('Cannot create a new massage in the past.'),
        _t.translate('Warning'));
      return;
    }

    var exampleMassage = {
      generated: true,
      date: slot.start,
      ending: slot.end,
      masseuse: "",
      client: null,
      facility: {id: this.state.facilities[this.state.index].id}
    };
    setTimeout(() => this.setState({
      modalActive: !this.state.modalActive,
      editMassage: exampleMassage
    }), 1);
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
        <div className="no-print">
          {this.state.facilities !== undefined && this.state.facilities.length > 0 ?
            <div>
              {this.state.loading ? <div className="loader pull-right"></div> : ''}
              <h1>
                { _t.translate('Massages in ') + this.state.facilities[this.state.index].name }
              </h1>
              <ul className="nav nav-tabs" style={{ 'marginBottom': '15px' }}>
                {this.state.facilities.map((item, index) => (
                  <Tab active={index === this.state.index} label={item.name} key={item.id}
                    onClick={() => this.changeTabIndex(index)} />
                ))}
              </ul>
              <MassageFilter
                free={this.state.freeOnly}
                onFreeCheck={this.changeFreeOnly}
                select={this.state.selectEvents}
                onSelectCheck={this.changeSelectEvents}
                filter={this.state.search}
                onFilterChange={this.changeSearch} />
              {Auth.isAdmin() ?
                <div className="row" style={{'marginBottom': '15px'}}>
                  <div className="col-md-6">
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
                    </div>
                    <div className="col-md-6 text-right">
                      <PrintModal
                        masseuses={this.state.masseuses}
                        facilityId={this.state.facilities[this.state.index].id}
                        date={this.state.selectedDate}
                        onPrint={this.setPrintMassages}
                      />
                      <MassageBatchAddModal
                        active={this.state.batchAddModalActive}
                        masseuses={this.state.masseuses}
                        facilityId={this.state.facilities[this.state.index].id}
                        getCallback={this.getMassages}
                        onToggle={(deselect) => this.toggleBatchAddModal(deselect)}
                      />
                      <MassageModal
                        active={this.state.modalActive}
                        massage={this.state.editMassage}
                        masseuses={this.state.masseuses}
                        facilityId={this.state.facilities[this.state.index].id}
                        getCallback={this.getMassages}
                        onToggle={() => this.toggleModal(null)}
                      />
                    </div>
                </div> :
                <div className="row" style={{'marginBottom': '15px'}}>
                  <div className="col-md-12 text-right">
                    <PrintModal
                      masseuses={this.state.masseuses}
                      facilityId={this.state.facilities[this.state.index].id}
                      date={this.state.selectedDate}
                      onPrint={this.setPrintMassages}
                    />
                  </div>
                </div>
              }
              <CalendarPanel
                events={this.state.events}
                selectEvents={this.state.selectEvents}
                selected={this.state.selected}
                massageMinutes={this.state.massageMinutes}
                onAssign={this.assignMassage}
                onCancel={this.cancelMassage}
                onAdd={this.toggleModalWithTime}
                onEdit={this.toggleModal}
                onDelete={this.deleteMassage}
                onDateChange={this.changeTimeRange}
                onSelect={this.handleEventSelect}
              />
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
        {this.state.printMassages !== null ?
          <div className="print-only">
            <h1>
              { _t.translate('Schedule') }
            </h1>
            <table className="table">
              <thead>
                <tr>
                  <th>{ _t.translate('Date') }</th>
                  <th>{ _t.translate('Time') }</th>
                  <th>{ _t.translate('Masseur/Masseuse') }</th>
                  <th width="40%">{ _t.translate('Client') }</th>
                </tr>
              </thead>
              <tbody>
                {this.createPrintRows()}
              </tbody>
            </table>
          </div> : ''
        }
      </div>
    );
  }
}

export default Massages
