// react imports
import React, { Component } from 'react';

// util imports
import Auth from '../../util/Auth';
import _t from '../../util/Translations';

/**
 * Link that redirects to Keycloak account management.
 */
class ProfileLink extends Component {

  viewProfile = () => {
      Auth.keycloak.accountManagement();
    }

  render() {
    return(
      <button type="button" className="btn btn-link navbar-btn"
        onClick={() => this.viewProfile()} title={ _t.translate("Show Keycloak profile") }>
        <span className="glyphicon glyphicon-user"></span>&nbsp;
          { _t.translate('Profile') }
      </button>
    )
  }
}

export default ProfileLink
