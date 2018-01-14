// react imports
import React, { Component } from 'react';
import { Link } from 'react-router-dom';

// component imports
import MyMassagePanel from '../components/panels/MyMassagePanel';
import '../styles/components/loader.css';

// module imports
import moment from 'moment';

// util imports
import Auth from '../util/Auth';
import _t from '../util/Translations';
import Util from '../util/Util';

/**
 * Panel list of all assigned massages sorted by timestamps.
 */
class MassagesList extends Component {

  state = {massages: [], loading: true}

  componentDidMount() {
    Util.clearAllIntervals();

    this.getMassages();
    setInterval(() => {
      this.getMassages();
    }, Util.AUTO_REFRESH_TIME * 60);
  }

  getMassages = () => {
    Util.get(Util.MASSAGES_URL + "client", (json) => {
      this.setState({massages: json, loading: false});
    });
  }

  createPanels = () => {
    var panels = [],
        i = 0,
        addHeader = true,
        headerTypes = ['Today', 'This week', 'Next week', 'Later than next week'],
        startOfTypes = ['day', 'week', 'week', 'year'];
    for (var timeType = 0; timeType < 4; timeType++) {
      for (i; i < this.state.massages.length; i++) {
        if (timeType !== 3 && !moment(this.state.massages[i].date).startOf(startOfTypes[timeType])
        .isSame(moment().add(timeType === 2 ? 7 : 0, 'days').startOf(startOfTypes[timeType]))) {
          addHeader = true;
          break;
        }
        if (addHeader) {
          panels.push(<h1 key={headerTypes[timeType]}>{ _t.translate(headerTypes[timeType]) }</h1>);
          addHeader = false;
        }
        let tooLate = (moment(this.state.massages[i].date).diff(moment(), 'minutes') <= Util.CANCELLATION_LIMIT);
        panels.push(
          <MyMassagePanel key={this.state.massages[i].id} type={tooLate ? "warning" : "info"} massage={this.state.massages[i]}
            getCallback={this.getMassages} disabled={tooLate && !Auth.isAdmin()} />
        );
      }
      panels.push(<div key={"row" + timeType} className="row"></div>);
    }
    return panels;
  }

  render() {
    return (
      <div>
        <h1>
          {this.state.loading ? <div className="loader pull-right"></div> : ''}
          { _t.translate('My Massages') }
        </h1>
        <hr />
        {this.state.massages.length > 0 ?
          this.createPanels()
        : <h3>
            { _t.translate('None') + " – "}
            <Link style={{ 'color': '#595959' }} to="/">{ _t.translate("Go to massages") }</Link>
          </h3>
        }
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
