// react imports
import React, { Component } from 'react';

// component imports
import CancelButton from '../components/CancelButton';

// module imports
import moment from 'moment';

// util imports
import _t from '../utils/Translations.js';
import Util from '../utils/Util.js';

/**
 * Tabled list of all assigned massages.
 */
class MassagesList extends Component {

  state = {massages: []}

  componentDidMount() {
    this.getMassages();
  }

  getMassages = () => {
    Util.get(Util.USERS_URL + "1" + "/massages", (json) => {
      this.setState({massages: json});
    });
  }

  cancelMassage = (massage) => {
    Util.put(Util.MASSAGES_URL + massage.id, {
      date: massage.date,
      masseuse: massage.masseuse,
      user: null,
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
        <table className="table table-hover table-responsive">
          <thead>
            <tr>
              <th>{ _t.translate('Facility') }</th>
              <th>{ _t.translate('Date') }</th>
              <th>{ _t.translate('Masseuse') }</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {this.state.massages.map((item, index) => (
              <tr key={index}>
                <td>{item.facility.name}</td>
                <td>{moment(item.date).format("DD. MM. HH:mm")}</td>
                <td>{item.masseuse}</td>
                <td width="55px">
                  <span className="pull-right">
                    <CancelButton onCancel={() => this.cancelMassage(item)} />
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
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
