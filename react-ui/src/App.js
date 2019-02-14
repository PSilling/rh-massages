// react imports
import React from "react";
import { BrowserRouter as Router, Route, Link, Switch, withRouter } from "react-router-dom";
import PropTypes from "prop-types";

// module imports
import { Navbar, NavbarBrand, Nav, NavItem, NavLink } from "reactstrap";
import moment from "moment";
import { NotificationContainer } from "react-notifications";
import "bootstrap/dist/css/bootstrap.min.css";
import "react-notifications/lib/notifications.css";
import "react-datetime/css/react-datetime.css";
import "react-big-calendar/lib/css/react-big-calendar.css";

// view imports
import Facilities from "./views/Facilities";
import Massages from "./views/Massages";
import MassagesArchive from "./views/MassagesArchive";
import MyMassages from "./views/MyMassages";
import Settings from "./views/Settings";

// component imports
import ErrorBoundary from "./components/util/ErrorBoundary";
import ProfileLink from "./components/links/ProfileLink";
import LangLink from "./components/links/LangLink";
import LogoutLink from "./components/links/LogoutLink";
import UnauthorizedMessage from "./components/util/UnauthorizedMessage";

// util imports
import _t from "./util/Translations";
import Auth from "./util/Auth";

// moment.js localization
moment.updateLocale("en", {
  months: _t
    .translate("January_February_March_April_May_June_July_August_September_October_November_December")
    .split("_"),
  monthsShort: _t.translate("Jan_Feb_Mar_Apr_May_Jun_Jul_Aug_Sep_Oct_Nov_Dec").split("_"),
  weekdays: _t.translate("Sunday_Monday_Tuesday_Wednesday_Thursday_Friday_Saturday").split("_"),
  weekdaysShort: _t.translate("Sun_Mon_Tue_Wed_Thu_Fri_Sat").split("_"),
  weekdaysMin: _t.translate("Su_Mo_Tu_We_Th_Fr_Sa").split("_"),
  longDateFormat: {
    LT: _t.translate("h:mm A"),
    L: _t.translate("DD/MM/YYYY")
  },
  week: {
    dow: _t.translate("7")
  }
});

/**
 * 404 page displayed when no route is matched.
 */
const NoMatch = ({ location }) => (
  <div className="text-center mt-5">
    <h4>
      <code>
        Error 404
        {_t.translate(" (page doesn't exist): ")}
        {location.pathname}
      </code>
    </h4>
    <h4 className="mt-4">
      <Link style={{ color: "#595959" }} to="/">
        {_t.translate("Back to main page")}
      </Link>
    </h4>
  </div>
);

/**
 * Application header.
 */
export const NavWithLinks = withRouter(({ location }) => (
  <Navbar color="light" light expand="md" className="no-print">
    <NavbarBrand>{_t.translate("Massages")}</NavbarBrand>
    <Nav navbar>
      <NavItem active={location.pathname === "/my-massages"}>
        <NavLink tag={Link} to="/my-massages" className="mr-1">
          {_t.translate("My Massages")}
        </NavLink>
      </NavItem>
      <NavItem active={location.pathname === "/"}>
        <NavLink tag={Link} to="/" className="mr-1">
          {_t.translate("Massages")}
        </NavLink>
      </NavItem>
      {Auth.isAdmin() && (
        <NavItem active={location.pathname === "/facilities"}>
          <NavLink tag={Link} to="/facilities" className="mr-1">
            {_t.translate("Facilities")}
          </NavLink>
        </NavItem>
      )}
      {Auth.isAdmin() && (
        <NavItem active={location.pathname === "/massages-archive"}>
          <NavLink tag={Link} to="/massages-archive" className="mr-1">
            {_t.translate("Massages Archive")}
          </NavLink>
        </NavItem>
      )}
      <NavItem active={location.pathname === "/settings"}>
        <NavLink tag={Link} to="/settings" className="mr-1">
          {_t.translate("Settings")}
        </NavLink>
      </NavItem>
    </Nav>
    <Nav navbar style={{ marginLeft: "auto", marginRight: "0" }}>
      <NavItem className="mr-1">
        <ProfileLink />
      </NavItem>
      <NavItem className="mr-1">
        <LogoutLink />
      </NavItem>
      <NavItem>
        <LangLink />
      </NavItem>
    </Nav>
  </Navbar>
));

/**
 * Application footer,
 */
const Footer = () => (
  <footer className="no-print container-fluid text-right fixed-bottom mr-3 mb-3">
    <a href="https://www.openshift.com/" title="Powered by OpenShift Online">
      <img alt="Powered by OpenShift Online" src="https://www.openshift.com/images/logos/powered_by_openshift.png" />
    </a>
  </footer>
);

/**
 * Main application component. Contains the Router, NotificationContainer and Navbar.
 */
const App = function App() {
  if (!Auth.isAuthenticated()) {
    return <UnauthorizedMessage title={_t.translate("Massages")} />;
  }

  return (
    <Router>
      <div>
        <NotificationContainer />

        <NavWithLinks />

        <div className="container">
          <ErrorBoundary>
            <Switch>
              <Route exact path="/" component={Massages} />
              <Route exact path="/my-massages" component={MyMassages} />
              <Route exact path="/facilities" component={Facilities} />
              <Route exact path="/massages-archive" component={MassagesArchive} />
              <Route exact path="/settings" component={Settings} />
              <Route component={NoMatch} />
            </Switch>
          </ErrorBoundary>
        </div>
        <Footer />
      </div>
    </Router>
  );
};

NoMatch.propTypes = {
  /** current router location */
  location: PropTypes.shape({
    pathname: PropTypes.string
  }).isRequired
};

export default App;
