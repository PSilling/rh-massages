// react imports
import React, { Component } from 'react';

// component imports
import CancelButton from '../components/buttons/CancelButton';
import CalendarButton from '../components/iconbuttons/CalendarButton';

// module imports
import moment from 'moment';

// util imports
import Auth from '../util/Auth';
import _t from '../util/Translations';
import Util from '../util/Util';

/**
 * Tabled list of all assigned massages.
 */
class MassagesList extends Component {

  state = {massages: []}

  componentDidMount() {
    Util.clearAllIntervals();

    this.getMassages();

    setInterval(() => {
      this.getMassages();
    }, Util.AUTO_REFRESH_TIME * 60);
  }

  getMassages = () => {
    Util.get(Util.MASSAGES_URL + "client", (json) => {
      json.sort(function(a, b) {
        return a.date - b.date;
      });

      for (var i = 0; i < json.length; i++) {
        if (moment(json[i].ending).isBefore(moment())) {
          json.splice(i, 1);
          i--;
        }
      }

      if (!Util.arraysEqual(this.state.massages, json)) {
        this.setState({massages: json});
      }
    });
  }

  cancelMassage = (massage) => {
    Util.put(Util.MASSAGES_URL + massage.id, {
      date: massage.date,
      ending: massage.ending,
      masseuse: massage.masseuse,
      client: null,
      facility: massage.facility
    }, this.getMassages);
  }

  render() {
    return(
      <div>
        <h1>
          { _t.translate('My Massages') }
        </h1>
        <hr />
        <table className="table table-hover table-responsive table-striped">
          <thead>
            <tr>
              <th>{ _t.translate('Facility') }</th>
              <th>{ _t.translate('Date') }</th>
              <th>{ _t.translate('Time') }</th>
              <th>{ _t.translate('Masseur/Masseuse') }</th>
              <th>{ _t.translate('Event') }</th>
              <th></th>
            </tr>
          </thead>
          {this.state.massages.length > 0 ?
            <tbody>
              {this.state.massages.map((item, index) => (
                <tr key={index}>
                  <td>{item.facility.name}</td>
                  <td>{moment(item.date).format("dd DD. MM.")}</td>
                  <td>{moment(item.date).format("HH:mm") + "–" + moment(item.ending).format("HH:mm")}</td>
                  <td>{item.masseuse}</td>
                  <td width="55px">
                    <span className="pull-right">
                      <CalendarButton disabled={false} onAdd={() => Util.addToCalendar(item)} />
                    </span>
                  </td>
                  <td width="55px">
                    <span className="pull-right">
                      <CancelButton onCancel={() => this.cancelMassage(item)}
                        disabled={(moment(item.date).diff(moment(), 'minutes') <= Util.CANCELLATION_LIMIT) && !Auth.isAdmin() ? true : false} />
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          : <tbody>
            <tr>
              <th colSpan="6">
                { _t.translate('None') }
              </th>
            </tr>
          </tbody>
        }
        </table>
      </div>
    );
  }
}

const MyMassages = () => (
  <div>
    <MassagesList />
  </div>
);

export default MyMassages
