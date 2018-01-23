// react imports
import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Link, Switch, withRouter } from 'react-router-dom';

// view imports
import Facilities from './views/Facilities.js';
import Massages from './views/Massages.js';
import MassagesArchive from './views/MassagesArchive.js';
import MyMassages from './views/MyMassages.js';

// component imports
import ProfileLink from './components/links/ProfileLink';
import LangLink from './components/links/LangLink';
import LogoutLink from './components/links/LogoutLink';

// module imports
import moment from 'moment';
import { NotificationContainer } from 'react-notifications';
import 'react-notifications/lib/notifications.css';

// util imports
import Auth from './util/Auth';
import _t from './util/Translations';

// Bootstrap customization file import
import './styles/main/bootstrap.min.css';

// moment.js localization
moment.updateLocale('en', {
  weekdaysMin : _t.translate('Su_Mo_Tu_We_Th_Fr_Sa').split('_')
});

/**
 * 404 page displayed when no route is matched.
 */
const NoMatch = ({ location }) => (
  <div className='text-center'>
    <h3>
      <code>Error 404:</code> { _t.translate("page doesn't exist:") } <code>{location.pathname}</code>
    </h3>
    <h3 style={{ 'marginTop': '30px' }}>
      { Auth.isAuthenticated() ? <Link style={{ 'color': '#595959' }} to="/">{ _t.translate("Back to main page") }</Link> : '' }
    </h3>
  </div>
)

// navigation bar with view links
const NavWithLinks = withRouter(({ location }) => (
  <nav className="navbar navbar-default">
    <div className="container-fluid">
      <div className="navbar-header">
        { Auth.isAuthenticated() ? <Link className="navbar-brand" to="/">{ _t.translate("Massages") }</Link> : '' }
      </div>
      <ul className="nav navbar-nav">
        { Auth.isAuthenticated() ?
          <li className={location.pathname === "/my-massages" ? "active" : ""}>
            <Link to="/my-massages">{ _t.translate("My Massages") }</Link>
          </li> : '' }
        { Auth.isAuthenticated() ?
          <li className={location.pathname === "/" ? "active" : ""}>
            <Link to="/">{ _t.translate("Massages") }</Link>
          </li> : '' }
        { Auth.isAdmin() ?
          <li className={location.pathname === "/facilities" ? "active" : ""}>
            <Link to="/facilities">{ _t.translate("Facilities") }</Link>
          </li> : '' }
        { Auth.isAdmin() ?
          <li className={location.pathname === "/massages-archive" ? "active" : ""}>
            <Link to="/massages-archive">{ _t.translate("Massages Archive") }</Link>
          </li> : '' }
      </ul>
      <ul className="nav navbar-nav navbar-right">
        <li>
          <ProfileLink />
        </li>
        <li>
          <LogoutLink />
        </li>
        <li>
          <LangLink />
        </li>
      </ul>
    </div>
  </nav>
))

/**
 * Main application component. Contains the Router, NotificationContainer and Navbar.
 */
class App extends Component {

  render() {
    if (!Auth.isAuthenticated()) {
      Auth.authenticate();
    }

    return (
      <Router>
        <div>
          <NotificationContainer/>

          <NavWithLinks />

          <div className='container'>
            <Switch>
              <Route exact path="/" component={Massages}/>
              <Route exact path="/my-massages" component={MyMassages}/>
              <Route exact path="/facilities" component={Facilities}/>
              <Route exact path="/massages-archive" component={MassagesArchive}/>
              <Route component={NoMatch}/>
            </Switch>
          </div>
        </div>
      </Router>
    );
  }
}

export default App
