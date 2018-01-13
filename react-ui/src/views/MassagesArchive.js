// react imports
import React, { Component } from 'react';

// component imports
import ArchiveMassageRow from '../components/rows/ArchiveMassageRow';
import BatchDeleteButton from '../components/buttons/BatchDeleteButton';
import Pager from '../components/util/Pager';
import MassageFilter from '../components/util/MassageFilter';
import UnauthorizedMessage from '../components/util/UnauthorizedMessage';

// module imports
import moment from 'moment';

// util imports
import Auth from '../util/Auth';
import _t from '../util/Translations';
import Util from '../util/Util';

/**
 * Old massages table.
 */
class ArchiveList extends Component {

  state = {massages: [], index: 0, page: 1, search: "", freeOnly: false,
            from: moment().subtract(1, 'years').format("YYYY-MM-DD"),
            to: moment().format("YYYY-MM-DD"), perPage: 12}

  componentDidMount() {
    Util.clearAllIntervals();

    this.getMassages();
    setInterval(() => {
      this.getMassages();
    }, Util.AUTO_REFRESH_TIME);
  }

  getMassages = (unlimited = false) => {
    Util.get(Util.MASSAGES_URL
      + "old?search=" + this.state.search
      + "&free=" + this.state.freeOnly
      + "&from=" + moment(this.state.from).unix() * 1000
      + "&to=" + moment(this.state.to).add(1, 'days').unix() * 1000
      + "&limit=" + (unlimited ? -1 : ((this.state.page * this.state.perPage) + 1)), (json) => {
      this.setState({massages: json});
      let pages = Math.ceil(json.length / this.state.perPage);
      if (unlimited) {
        this.setState({page: pages});
      } else if (this.state.page > pages) {
        this.setState({page: pages === 0 ? 1 : pages});
      }
    });
  }

  deleteMassage = (id) => {
    Util.delete(Util.MASSAGES_URL + "?ids=" + id, this.getMassages);
  }

  deleteAllMassages = () => {
    Util.get(Util.MASSAGES_URL + "old?search=" + this.state.search, (json) => {
      if (json.length === 0) {
        return;
      }
      var idString = "?";
      for (var i = 0; i < json.length; i++) {
        if (idString.length > 2000) {
          break;
        }
        idString += "ids=" + json[i].id + "&";
      }
      Util.delete(Util.MASSAGES_URL + idString, this.getMassages);
    });
  }

  changePage = (page) => {
    if (page === -1) {
      this.getMassages(true);
    } else {
      this.setState({page: page});
      this.getMassages();
    }
  }

  changePerPage = (event) => {
    if (Util.isEmpty(event.target.value) || parseInt(event.target.value, 10) < 5
        || parseInt(event.target.value, 10) > 55) {
      return;
    }
    this.setState({perPage: parseInt(event.target.value, 10)});
  }

  changeSearch = (event) => {
    this.setState({search: event.target.value});
  }

  changeFreeOnly = (event) => {
    this.setState({freeOnly: event.target.checked});
    setTimeout(() => this.getMassages(), 3);
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

  changeTabIndex = (index) => {
    this.setState({index: index, page: 1});
    this.getMassages();
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
          { _t.translate('Massages Archive') }
        </h1>
        <MassageFilter checked={this.state.freeOnly} onCheck={this.changeFreeOnly}
          value={this.state.search} onSearchChange={this.changeSearch}
          from={this.state.from} onFromChange={this.changeFrom}
          to={this.state.to} onToChange={this.changeTo} />
        <table className="table table-hover table-responsive table-striped table-condensed">
          <thead>
            <tr>
              <th>{ _t.translate('Facility') }</th>
              <th>{ _t.translate('Date') }</th>
              <th>{ _t.translate('Time') }</th>
              <th>{ _t.translate('Masseur/Masseuse') }</th>
              <th width="35%">{ _t.translate('Status') }</th>
              <th>
                <span className="pull-right">
                  <BatchDeleteButton onDelete={this.deleteAllMassages}
                    label={ _t.translate('Delete all') } />
                </span>
              </th>
            </tr>
          </thead>
          {this.state.massages.length > 0 ?
            <tbody>
              {this.state.massages.slice(0, this.state.page * this.state.perPage)
                .map((item, index) => (
                <ArchiveMassageRow key={item.id} massage={item} search={this.state.search}
                  onDelete={() => this.deleteMassage(item.id)} />
              ))}
            </tbody> :
            <tbody>
              <tr>
                <th colSpan="6">
                  { _t.translate('None') }
                </th>
              </tr>
            </tbody>
          }
        </table>
        {this.state.massages.length > 0 ?
          <Pager massages={this.state.massages.length}
            perPage={this.state.perPage} onPerPageChange={this.changePerPage}
            page={this.state.page} onPageChange={(page) => this.changePage(page)} /> : ''
        }
      </div>
    );
  }
}

const MassagesArchive = () => (
  <div>
    <ArchiveList />
  </div>
);

export default MassagesArchive
