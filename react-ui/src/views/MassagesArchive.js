// react imports
import React, { Component } from 'react';

// component imports
import BatchDeleteButton from '../components/buttons/BatchDeleteButton';
import DeleteButton from '../components/iconbuttons/DeleteButton';
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
 * Old massages table with year sorting.
 */
class MassagesList extends Component {

  state = {years: [], allMassages: [], massages: [], index: 1, page: 1, search: ""}

  componentDidMount() {
    Util.clearAllIntervals();

    this.getMassages();

    setInterval(() => {
      this.getMassages(this.state.index-1);
    }, Util.AUTO_REFRESH_TIME * 30);

    setInterval(() => {
      this.searchMassages();
    }, 750);
  }

  getMassages = () => {
    Util.get(Util.MASSAGES_URL, (json) => {
      json.sort(function(a, b) {
        return a.date - b.date;
      });

      for (var i = 0; i < json.length; i++) {
        if (moment(json[i].date).isAfter(moment())) {
          json.splice(i, 1);
          i--;
        }
      }

      var years = [];

      for (i = 0; i < json.length; i++) {
        if (years.indexOf(moment(json[i].date).format("YYYY")) === -1) {
          years.push(moment(json[i].date).format("YYYY"));
        }
      }

      if (!Util.arraysEqual(this.state.years, years)) {
        this.setState({years: years});
      }

      for (i = 0; i < json.length; i++) {
        if (moment(json[i].date).format("YYYY") !== this.state.years[this.state.index-1]) {
          json.splice(i, 1);
          i--;
        }
      }

      if (!Util.arraysEqual(this.state.allMassages, json)) {
        this.setState({allMassages: json});
      }
    });
  }

  deleteMassage = (id) => {
    Util.delete(Util.MASSAGES_URL + id, () => this.getMassages());
  }

  deleteAllMassages = () => {
    var callback = () => {
      this.getMassages();
    }

    for (var i = 0; i < this.state.allMassages.length; i++) {
      Util.delete(Util.MASSAGES_URL + this.state.allMassages[i].id, callback,
        this.state.allMassages.length === (i + 1) ? true : false);
    }
  }

  changePage = (page) => {
    this.setState({page: page});
  }

  changeSearch = (event) => {
    this.setState({search: event.target.value});
  }

  searchMassages = () => {
    var massages = [];
    var searchString = "";
    for (var i = 0; i < this.state.allMassages.length; i++) {
      searchString = (moment(this.state.allMassages[i].date).format("dd DD. MM. HH:mm")
                      + this.state.allMassages[i].masseuse + this.state.allMassages[i].facility.name).toLowerCase();
      if (searchString.includes(this.state.search.toLowerCase())) {
        massages.push(this.state.allMassages[i]);
      }
    }
    if (!Util.arraysEqual(this.state.massages, massages)) {
      this.setState({massages: massages, page: 1});
    }
  }

  onTabChange = (index) => {
    this.getMassages(index-1);

    this.setState({index: index, page: 1});
  }

  render () {
    if (!Auth.isAdmin()) {
      return(
        <UnauthorizedMessage title={ _t.translate('Massages Archive') } />
      );
    }

    return (
      <div>
        <h1>
          { _t.translate('Massages Archive') }
        </h1>
        {this.state.years.length > 0 ?
          <Tabs tabActive={this.state.index} onAfterChange={this.onTabChange}>
            {this.state.years.map((item) => (
              <Tabs.Panel title={item} key={item}>
                <SearchField value={this.state.search} onChange={this.changeSearch} />
                <br />
                <table className="table table-hover table-responsive table-striped table-condensed">
                  <thead>
                    <tr>
                      <th>{ _t.translate('Facility') }</th>
                      <th>{ _t.translate('Date') }</th>
                      <th>{ _t.translate('Time') }</th>
                      <th>{ _t.translate('Masseur/Masseuse') }</th>
                      <th width="40%">{ _t.translate('Status') }</th>
                      {Auth.isAdmin() ?
                        <th>
                          <BatchDeleteButton onDelete={() => this.deleteAllMassages()}
                            disabled={false} label={ _t.translate('Delete all') } />
                        </th> : <th className="hidden"></th>
                      }
                    </tr>
                  </thead>
                  {this.state.massages.length > 0 ?
                    <tbody>
                      {this.state.massages.slice(0, this.state.page * Util.MASSAGES_PER_PAGE)
                        .map((item, index) => (
                        <tr key={index}>
                          <td>{item.facility.name}</td>
                          <td>{moment(item.date).format("dd DD. MM.")}</td>
                          <td>{moment(item.date).format("HH:mm") + "–" + moment(item.ending).format("HH:mm")}</td>
                          <td>{item.masseuse}</td>
                          {Util.isEmpty(item.client) ?
                            <td className="success">
                              { _t.translate('Free') }
                            </td> :
                            <td className={ "danger" }>
                              {Util.isEmpty(item.contact) ? _t.translate('Full') : _t.translate('Full') + " – " + item.contact}
                            </td>
                          }
                          {Auth.isAdmin() ?
                            <td width="55px">
                              <DeleteButton onDelete={() => this.deleteMassage(item.id)} />
                            </td> : <td className="hidden"></td>
                          }
                        </tr>
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

const MassagesArchive = () => (
  <div>
    <MassagesList />
  </div>
);

export default MassagesArchive
