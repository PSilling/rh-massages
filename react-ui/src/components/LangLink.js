// react imports
import React, { Component } from 'react';
import { BrowserRouter as Link } from 'react-router-dom';

// util imports
import _t from '../utils/Translations.js';

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
      <button type="button" className="btn btn-link navbar-btn" onClick={() => this.changeLanguage()}>
        <span className="glyphicon glyphicon-globe"></span>&nbsp;
        { localStorage.getItem("sh-locale") === 'en' ? 'CZ' : 'EN' }
      </button>
    )
  }
}

export default LangLink
