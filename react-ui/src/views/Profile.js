// react imports
import React, { Component } from 'react';

// util imports
import _t from '../utils/Translations.js';
import Util from '../utils/Util.js';

/**
 * User profile page
 */
class ProfileView extends Component {

  state = {user: {}}

  componentDidMount() {
    this.getUser();
  }

  getUser = () => {
    Util.get(Util.USERS_URL + "1", (json) => {
      this.setState({user: json});
    });
  }

  render () {
    return (
      <div>
        <h1>
          { this.state.user.admin ? _t.translate('Profile (admin)') : _t.translate('Profile') }
        </h1>
        <hr />
        <div className="col-md-6">
          <div className="list-group">
            <a className="list-group-item">
              <h4 className="list-group-item-heading">
                { _t.translate('Email') }
              </h4>
              <h4 className="list-group-item-text">
                {this.state.user.email}
              </h4>
            </a>
            <a className="list-group-item">
              <h4 className="list-group-item-heading">
                { _t.translate('Name') }
              </h4>
              <h4 className="list-group-item-text">
                {this.state.user.name}
              </h4>
            </a>
            <a className="list-group-item">
              <h4 className="list-group-item-heading">
                { _t.translate('Total massages') }
              </h4>
              <h4 className="list-group-item-text">
                {Util.isEmpty(this.state.user.massages) ?
                  _t.translate('No assigned massages') : this.state.user.massages.length}
              </h4>
            </a>
          </div>
        </div>
      </div>
    );
  }
}

const Profile = () => (
  <div>
    <ProfileView />
  </div>
);

export default Profile;
