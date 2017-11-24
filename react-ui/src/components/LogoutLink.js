// react imports
import React, { Component } from 'react';

// util imports
import Auth from '../utils/Auth.js';
import _t from '../utils/Translations.js';
import Util from '../utils/Util.js';

/**
 * Link that redirects to Keycloak logout and the application after backend logout.
 */
class LogoutLink extends Component {

  logout = () => {
      fetch(Util.LOGOUT_URL, {
        method: 'get',
        headers: {
          'Authorization': 'Bearer ' + Auth.getToken()
        }
      }).then(function(response) {
        if (response.ok) {
          Auth.keycloak.logout();
        } else {
          Util.notify("error", _t.translate('Your request has ended unsuccessfully.'),
            _t.translate('An error occured!'));
        }
      });
    }

  render() {
    return(
      <button type="button" className="btn btn-link navbar-btn" onClick={() => this.logout()}>
        <span className="glyphicon glyphicon-log-out"></span>&nbsp;
          { _t.translate('Logout') }
      </button>
    )
  }
}

export default LogoutLink
