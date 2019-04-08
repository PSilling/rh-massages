// react imports
import React, { Component } from "react";
import { Link } from "react-router-dom";
import { Nav } from "reactstrap";

// component imports
import InfoAlert from "../components/util/InfoAlert";
import MyMassagePanel from "../components/panels/MyMassagePanel";
import Tab from "../components/navs/Tab";
import "../styles/components/loader.css";

// util imports
import _t from "../util/Translations";
import Fetch from "../util/Fetch";
import Util from "../util/Util";

/**
 * Main view component for My Massages management. Uses Massage information panels
 * for better user experience.
 */
class MyMassages extends Component {
  state = { events: [], filteredEvents: [], facilities: [], loading: true, index: 0, mounted: false };

  alertMessage =
    _t.translate("On this page you can view all your assigned massages. ") +
    _t.translate("To view massage details click on the event name.");

  componentDidMount() {
    Util.clearAllIntervals();

    this.setState({ mounted: true });
    this.getFacilities();
    setInterval(() => {
      this.getMassages();
    }, Util.AUTO_REFRESH_TIME * 60);
  }

  componentWillUnmount() {
    Util.clearAllIntervals();
    this.setState({ mounted: false });
  }

  getFacilities = () => {
    Fetch.get(Util.FACILITIES_URL, json => {
      if (this.state.mounted) {
        this.setState({ facilities: json });
        this.getMassages();
      }
    });
  };

  getMassages = () => {
    Fetch.get(`${Util.MASSAGES_URL}client`, json => {
      if (this.state.mounted && json !== undefined) {
        this.updateEvents(json);
      }
    });
  };

  updateEvents = massages => {
    const events = [];

    for (let i = 0; i < massages.length; i++) {
      events.push({ massage: massages[i] });
    }

    this.setState(prevState => ({
      events,
      filteredEvents: this.getFilteredEvents(events, prevState.index),
      loading: false
    }));
  };

  cancelMassage = massage => {
    Fetch.put(
      Util.MASSAGES_URL,
      [
        {
          id: massage.id,
          date: massage.date,
          ending: massage.ending,
          masseuse: massage.masseuse,
          client: null,
          facility: massage.facility
        }
      ],
      this.getMassages
    );
  };

  getFilteredEvents = (events, index) => {
    const filteredEvents = [...events];

    if (index !== 0) {
      for (let i = 0; i < filteredEvents.length; i++) {
        if (filteredEvents[i].massage.facility.id !== this.state.facilities[index - 1].id) {
          filteredEvents.splice(i, 1);
          i--;
        }
      }
    }

    return filteredEvents;
  };

  closeAlert = () => {
    localStorage.setItem("closeMyMassagesAlert", true);
    this.setState(prevState => ({ loading: prevState.loading }));
  };

  changeTabIndex = index => {
    this.setState(prevState => ({ index, filteredEvents: this.getFilteredEvents(prevState.events, index) }));
  };

  render() {
    return (
      <div className="my-3">
        {!localStorage.getItem("closeMyMassagesAlert") && (
          <InfoAlert onClose={this.closeAlert}>{this.alertMessage}</InfoAlert>
        )}
        <div className="no-print">
          {this.state.loading && <div className="loader float-right" style={{ marginTop: "-1.4em" }} />}
          <Nav tabs className="mb-3 mt-4">
            <Tab active={this.state.index === 0} label={_t.translate("All")} onClick={() => this.changeTabIndex(0)} />
            {this.state.facilities.map((item, index) => (
              <Tab
                active={index + 1 === this.state.index}
                label={item.name}
                key={item.id}
                onClick={() => this.changeTabIndex(index + 1)}
              />
            ))}
          </Nav>
        </div>
        {this.state.filteredEvents.length > 0 && this.state.events[0] !== undefined ? (
          <MyMassagePanel events={this.state.filteredEvents} onCancel={this.cancelMassage} />
        ) : (
          <h3>
            {`${_t.translate("None")} – `}
            <Link style={{ color: "#595959" }} to="/">
              {_t.translate("Go to massages")}
            </Link>
          </h3>
        )}
      </div>
    );
  }
}

export default MyMassages;
