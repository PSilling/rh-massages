// react imports
import React, { Component } from 'react';

// component imports
import BatchDeleteButton from '../components/buttons/BatchDeleteButton';
import CalendarPanel from '../components/panels/CalendarPanel';
import MassageFilter from '../components/util/MassageFilter';
import UnauthorizedMessage from '../components/util/UnauthorizedMessage';
import '../styles/components/loader.css';

// module imports
import moment from 'moment';

// util imports
import Auth from '../util/Auth';
import _t from '../util/Translations';
import Util from '../util/Util';

/**
 * Main view calendar component for Massage Archive management. Viewable only for administrators.
 * For archived Massages only removal is supported.
 */
class MassagesArchive extends Component {

  state = {events: [], index: 0, search: "", freeOnly: false,
              loading: true, selected: [], selectEvents: false,
              from: moment().startOf('month').subtract(37, 'days'),
              to: moment().endOf('month').add(37, 'days')}

  componentDidMount() {
    Util.clearAllIntervals();

    this.getMassages();
    setInterval(() => {
      this.getMassages();
    }, Util.AUTO_REFRESH_TIME);
  }

  getMassages = () => {
    Util.get(Util.MASSAGES_URL
      + "old?search=" + this.state.search
      + "&free=" + this.state.freeOnly
      + "&from=" + moment(this.state.from).unix() * 1000
      + "&to=" + moment(this.state.to).add(1, 'days').unix() * 1000, (json) => {
      this.updateEvents(json.massages);
    });
  }

  updateEvents = (massages) => {
    var events = [],
        color;

    for (var i = 0; i < massages.length; i++) {
      if (Util.isEmpty(massages[i].client)) {
        color = "#00ac46"; // Bootsrap warning color (buttons)
      } else {
        color = "#e2001d"; // Bootsrap danger color (buttons)
      }
      events.push({massage: massages[i], bgColor: color});
    }

    let selected = this.state.selected;
    for (i = 0; i < selected.length; i++) {
      if (Util.findInArrayById(massages, selected[i].id) === -1) {
        selected.splice(i, 1);
        i--;
      }
    }

    this.setState({events: events, selected: selected, loading: false});
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

  /**
   * Removes all old Massages from the server.
   */
  deleteAllMassages = () => {
    Util.get(Util.MASSAGES_URL
      + "old?search=" + this.state.search
      + "&free=" + this.state.freeOnly
      + "&from=" + moment(this.state.from).unix() * 1000
      + "&to=" + moment(this.state.to).add(1, 'days').unix() * 1000, (json) => {
      if (json.massages.length === 0) {
        return;
      }
      var idString = "?";
      for (var i = 0; i < json.massages.length; i++) {
        if (idString.length > 2000) {
          Util.delete(Util.MASSAGES_URL + idString, this.getMassages);
          idString = "?";
        }
        idString += "ids=" + json.massages[i].id + "&";
      }
      Util.delete(Util.MASSAGES_URL + idString, this.getMassages);
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
        to: moment.endOf('month').add(37, 'days'),
        loading: true, selected: []
      });
    } else {
      this.setState({
        from: moment.clone().startOf('isoWeek').subtract(7, 'days'),
        to: moment.endOf('isoWeek').add(5, 'days'),
        loading: true, selected: []
      });
    }
  }

  render () {
    if (!Auth.isAdmin()) {
      return (
        <UnauthorizedMessage title={ _t.translate('Massages Archive') } />
      );
    }

    return (
      <div>
        <h1>
          {this.state.loading ? <div className="loader pull-right"></div> : ''}
          { _t.translate('Massages Archive') }
        </h1>
        <hr />
        <MassageFilter
          free={this.state.freeOnly}
          onFreeCheck={this.changeFreeOnly}
          select={this.state.selectEvents}
          onSelectCheck={this.changeSelectEvents}
          filter={this.state.search}
          onFilterChange={this.changeSearch} />
        <div className="row" style={{'marginBottom': '15px'}}>
          <div className="col-md-12 text-right">
            <BatchDeleteButton onDelete={this.deleteSelectedMassages}
              label={ _t.translate('Delete selected') }
              disabled={this.state.selected.length === 0} />
            <span style={{ 'marginLeft': '5px' }}>
              <BatchDeleteButton onDelete={this.deleteAllMassages}
                label={ _t.translate('Delete all') } />
            </span>
          </div>
        </div>
        <CalendarPanel
          events={this.state.events}
          selectEvents={this.state.selectEvents}
          selected={this.state.selected}
          allowEditation={false}
          onDelete={this.deleteMassage}
          onDateChange={this.changeTimeRange}
          onSelect={this.handleEventSelect}
        />
      </div>
    );
  }
}

export default MassagesArchive
