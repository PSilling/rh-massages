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
import Auth from "../util/Auth";
import Fetch from "../util/Fetch";
import Util from "../util/Util";

/**
 * Main view component for My Massages management. Uses Massage information panels
 * for better user experience.
 */
class MyMassages extends Component {
  state = { events: [], filteredEvents: [], facilities: [], loading: true, index: 0 };

  alertMessage =
    _t.translate("On this page you can view all your assigned massages. ") +
    _t.translate("To view massage details click on the event name.");

  closeAlertStorageString = `closeMyMassagesAlert-${Auth.getSub()}`;

  componentDidMount() {
    this.getFacilities();
    Fetch.WEBSOCKET_CALLBACKS.facility = this.facilityCallback;
    Fetch.WEBSOCKET_CALLBACKS.massage = this.massageCallback;
    Fetch.WEBSOCKET_CALLBACKS.client = this.clientCallback;
    Fetch.tryWebSocketSend("ADD_Facility");
    Fetch.tryWebSocketSend("ADD_Massage");
  }

  componentWillUnmount() {
    Fetch.WEBSOCKET_CALLBACKS.facility = null;
    Fetch.WEBSOCKET_CALLBACKS.massage = null;
    Fetch.WEBSOCKET_CALLBACKS.client = null;
    Fetch.tryWebSocketSend("REMOVE_Facility");
    Fetch.tryWebSocketSend("REMOVE_Massage");
  }

  getFacilities = () => {
    Fetch.get(Util.FACILITIES_URL, json => {
      this.setState({ facilities: json });
      this.getMassages();
    });
  };

  getMassages = () => {
    Fetch.get(`${Util.MASSAGES_URL}client`, json => {
      if (json !== undefined) {
        this.updateEvents(json);
      }
    });
  };

  facilityCallback = (operation, facility) => {
    const facilities = [...this.state.facilities];
    const index = Util.findInArrayById(facilities, facility.id);

    if (index === -1 && operation !== Fetch.OPERATION_ADD) {
      return;
    }

    switch (operation) {
      case Fetch.OPERATION_ADD:
        facilities.push(facility);
        break;
      case Fetch.OPERATION_CHANGE:
        facilities[index] = facility;
        break;
      case Fetch.OPERATION_REMOVE:
        facilities.splice(index, 1);
        break;
      default:
        console.log(`Invalid WebSocket operation. Found: ${operation}.`); /* eslint-disable-line */
        break;
    }

    this.setState(() => ({ facilities }));
  };

  massageCallback = (operation, massage) => {
    const events = [...this.state.events];
    const index = Util.findInArrayByMassageId(events, massage.id);

    if (
      (Auth.isMasseur() && massage.masseuse.sub !== Auth.getSub()) ||
      (!Auth.isMasseur() && (massage.client === null || Auth.getSub() !== massage.client.sub))
    ) {
      if (index !== -1) {
        events.splice(index, 1);
        this.setState(prevState => ({ events, filteredEvents: this.getFilteredEvents(events, prevState.index) }));
      }
      return;
    }

    const facilityIndex = Util.findInArrayById(this.state.facilities, massage.facility.id);
    if (facilityIndex !== -1) {
      massage.facility.name = this.state.facilities[facilityIndex].name;
    }

    switch (operation) {
      case Fetch.OPERATION_ADD:
        events.push({ massage });
        break;
      case Fetch.OPERATION_CHANGE:
        if (index === -1) {
          events.push({ massage });
        } else {
          events[index].massage = massage;
        }
        break;
      case Fetch.OPERATION_REMOVE:
        if (index !== -1) {
          events.splice(index, 1);
        }
        break;
      default:
        console.log(`Invalid WebSocket operation. Found: ${operation}.`); /* eslint-disable-line */
        break;
    }

    this.setState(prevState => ({ events, filteredEvents: this.getFilteredEvents(events, prevState.index) }));
  };

  clientCallback = (operation, client) => {
    if (client.sub === Auth.getSub() && Fetch.OPERATION_REMOVE) {
      Auth.keycloak.logout();
    }
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
      () => {},
      true,
      null,
      Util.isEmpty(massage.client) || Auth.getSub() === massage.client.sub ? null : {}
    );
  };

  closeAlert = () => {
    localStorage.setItem(this.closeAlertStorageString, true);
    this.setState(prevState => ({ loading: prevState.loading }));
  };

  changeTabIndex = index => {
    this.setState(prevState => ({ index, filteredEvents: this.getFilteredEvents(prevState.events, index) }));
  };

  render() {
    return (
      <div className="my-3">
        {!localStorage.getItem(this.closeAlertStorageString) && (
          <InfoAlert onClose={this.closeAlert}>{this.alertMessage}</InfoAlert>
        )}
        <div className="no-print">
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
            <span style={{ width: "100%" }}>
              {this.state.loading && <div className="loader float-right" style={{ marginTop: "-2.5em" }} />}
            </span>
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
