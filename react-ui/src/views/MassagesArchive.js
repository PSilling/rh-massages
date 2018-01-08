// react imports
import React, { Component } from 'react';

// component imports
import ArchiveMassageRow from '../components/rows/ArchiveMassageRow';
import BatchDeleteButton from '../components/buttons/BatchDeleteButton';
import Pager from '../components/util/Pager';
import SearchField from '../components/util/SearchField';
import UnauthorizedMessage from '../components/util/UnauthorizedMessage';

// util imports
import Auth from '../util/Auth';
import _t from '../util/Translations';
import Util from '../util/Util';

/**
 * Old massages table.
 */
class ArchiveList extends Component {

  state = {massages: [], index: 0, page: 1, search: ""}

  componentDidMount() {
    Util.clearAllIntervals();

    this.getMassages();
    setInterval(() => {
      this.getMassages();
    }, Util.AUTO_REFRESH_TIME);
  }

  getMassages = (unlimited = false) => {
    Util.get(Util.MASSAGES_URL + "old?search=" + this.state.search
      + "&limit=" + (unlimited ? -1 : ((this.state.page * Util.MASSAGES_PER_PAGE) + 1)), (json) => {
      this.setState({massages: json});
      let pages = Math.ceil(json.length / Util.MASSAGES_PER_PAGE);
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

  changeSearch = (event) => {
    this.setState({search: event.target.value});
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
        <SearchField value={this.state.search} onChange={this.changeSearch} />
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
              {this.state.massages.slice(0, this.state.page * Util.MASSAGES_PER_PAGE)
                .map((item, index) => (
                <ArchiveMassageRow key={item.id} massage={item}
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
          <Pager massages={this.state.massages.length} page={this.state.page}
            onChange={(page) => this.changePage(page)} /> : ''
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
