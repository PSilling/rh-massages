// react imports
import React, { Component } from 'react';

// component imports
import InfoAlert from '../components/util/InfoAlert';
import '../styles/components/loader.css';

// util imports
import Auth from '../util/Auth';
import _t from '../util/Translations';
import Util from '../util/Util';

/**
 * View containing portal and user settings.
 */
class Settings extends Component {

  state = {notify: false, loading: true}

  alertMessage = _t.translate('On this page you can manage your local user settings. You can also use this page to access our repository on GitHub.')

  componentDidMount() {
    Util.clearAllIntervals();

    this.getSettings();
    setInterval(() => {
      this.getSettings();
    }, Util.AUTO_REFRESH_TIME * 600);
  }

  getSettings = () => {
    Util.get(Util.CLIENTS_URL + 'my/subscribed', (json) => {
      this.setState({notify: json, loading: false});
    });
  }

  changeNotify = (event) => {
    Auth.subscribed = event.target.checked;
    Util.put(Util.CLIENTS_URL, Auth.getClient(), () => {
      this.setState({notify: Auth.subscribed});
    }, false);
  }

  closeAlert = () => {
    localStorage.setItem('closeSettingsAlert', true);
    this.setState({loading: this.state.loading});
  }

  render () {
    return (
      <div>
        {!localStorage.getItem('closeSettingsAlert') ?
          <InfoAlert onClose={this.closeAlert}>
            {this.alertMessage}
          </InfoAlert> : ''
        }
        <h1>
          {this.state.loading ? <div className="loader pull-right"></div> : ''}
          { _t.translate('Settings') }
        </h1>
        <hr />
        <h3>
          { _t.translate('User settings') }
        </h3>
        <div className="row">
          <div className="col-md-12">
            <div className="form-group">
              <label className="checkbox-inline">
                <input type="checkbox" onChange={this.changeNotify} checked={this.state.notify} />
                { _t.translate('I want to recieve information about ') }
                <abbr title={ _t.translate('Scheduling of new and cancellation of assigned massages') } style={{ 'cursor': 'pointer' }}>
                  { _t.translate('massage changes') }
                </abbr>
              </label>
            </div>
          </div>
        </div>

        <h3>
          { _t.translate('About') }
        </h3>
        <div className="row">
          <div className="col-md-12">
            { _t.translate('Visit our ') }
            <a href={Util.GITHUB_URL} target="_blank">
              GitHub
            </a>&nbsp;
            <del>
              { _t.translate(' and our ')}
              <a href={Util.GITHUB_URL + "wiki"} target="_blank">
                wiki
              </a>
            </del>! (WIP)
          </div>
        </div>
        <div className="row">
          <div className="col-md-12">
            { _t.translate('Report issues ') }
            <a href={Util.GITHUB_URL + "issues"} target="_blank">
              { _t.translate('here') }
            </a>.
          </div>
        </div>
      </div>
    );
  }
}

export default Settings
