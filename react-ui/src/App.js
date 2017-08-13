// react imports
import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Link, Switch, Redirect, withRouter } from 'react-router-dom';

// view imports
import Facilities from './views/Facilities.js';
import Massages from './views/Massages.js';
import MyMassages from './views/MyMassages.js';
import Profile from './views/Profile.js';

// component imports
import LangLink from './components/LangLink';

// module imports
import { NotificationContainer } from 'react-notifications';
import 'react-notifications/lib/notifications.css';

// util imports
import Auth from './utils/Auth.js';
import _t from './utils/Translations.js';

/**
 * '404' page - displayed when no route is matched
 */
const NoMatch = ({ location }) => (
  <div className='text-center'>
    <h3>
      <code>Error 404:</code> { _t.translate("page doesn't exist:") } <code>{location.pathname}</code>
    </h3>
  </div>
)

// navigation bar with view links
const NavWithLinks = withRouter(() => (
  <nav className="navbar navbar-default">
    <div className="container-fluid">
      <div className="navbar-header">
        <Link className="navbar-brand" to="/">{ _t.translate("Massages") }</Link>
      </div>
      <ul className="nav navbar-nav">
        <li>
          <Link to="/">{ _t.translate("Massages") }</Link>
        </li>
        { Auth.isAuthenticated ?
          <li>
            <Link to="/my-massages">{ _t.translate("My Massages") }</Link>
          </li> : '' }
        { Auth.isAuthenticated ?
          <li>
            <Link to="/profile">{ _t.translate("Profile") }</Link>
          </li> : '' }
        { Auth.isAdmin ?
          <li>
            <Link to="/facilities">{ _t.translate("Facilities") }</Link>
          </li> : '' }
      </ul>
      <ul className="nav navbar-nav navbar-right">
        <li>
          <LangLink />
        </li>
      </ul>
    </div>
  </nav>
))

// route with authorization enforcement
const PrivateRoute = ({ component: Component, ...rest }) => (
  <Route {...rest} render={props => (
    Auth.isAuthenticated() ? (
      <Component {...props}/>
    ) : (
      <Redirect to={{
        pathname: '/',
        state: { from: props.location }
      }}/>
    )
  )}/>
)

// main application component
class App extends Component {

  render() {
    return (
      <Router>
        <div>
          <NotificationContainer/>

          <NavWithLinks />

          <div className='container'>
            <Switch>
              <Route exact path="/" component={Massages}/>
              <PrivateRoute exact path="/my-massages" component={MyMassages}/>
              <PrivateRoute exact path="/facilities" component={Facilities}/>
              <PrivateRoute path="/profile" component={Profile}/>
              <Route component={NoMatch}/>
            </Switch>
          </div>
        </div>
      </Router>
    );
  }
}

export default App
