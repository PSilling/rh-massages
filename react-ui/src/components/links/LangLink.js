// react imports
import React, { Component } from 'react';

// util imports
import _t from '../../util/Translations';

/**
 * Language changer.
 */
class LangLink extends Component {

  changeLanguage = () => {
      var locale = localStorage.getItem("sh-locale") === 'en' ? 'cs' : 'en';
      localStorage.setItem("sh-locale", locale);
      _t.setLocale(locale);
      window.location.reload();
    }

  render() {
    return(
      <button type="button" className="btn btn-link navbar-btn"
        onClick={this.changeLanguage} title={ _t.translate("Change language to czech") }>
        <span className="glyphicon glyphicon-globe"></span>&nbsp;
        { localStorage.getItem("sh-locale") === 'en' ? 'CZ' : 'EN' }
      </button>
    )
  }
}

export default LangLink
