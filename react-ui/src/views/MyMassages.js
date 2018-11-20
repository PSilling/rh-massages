// react imports
import React, { Component } from "react";
import { Link } from "react-router-dom";

// component imports
import InfoAlert from "../components/util/InfoAlert";
import MyMassagePanel from "../components/panels/MyMassagePanel";
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
  state = { events: [], loading: true, mounted: false };

  alertMessage =
    _t.translate("On this page you can view all your assigned massages. ") +
    _t.translate("To view massage details click on the event name.");

  componentDidMount() {
    Util.clearAllIntervals();

    this.setState({ mounted: true });
    this.getMassages();
    setInterval(() => {
      this.getMassages();
    }, Util.AUTO_REFRESH_TIME * 60);
  }

  componentWillUnmount() {
    Util.clearAllIntervals();
    this.setState({ mounted: false });
  }

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

    this.setState({ events, loading: false });
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

  closeAlert = () => {
    localStorage.setItem("closeMyMassagesAlert", true);
    this.setState(prevState => ({ loading: prevState.loading }));
  };

  render() {
    return (
      <div className="my-3">
        {!localStorage.getItem("closeMyMassagesAlert") && (
          <InfoAlert onClose={this.closeAlert}>{this.alertMessage}</InfoAlert>
        )}
        <h1>
          {this.state.loading && <div className="loader float-right" />}
          {_t.translate("My Massages")}
        </h1>
        {this.state.events.length > 0 && this.state.events[0] !== undefined ? (
          <MyMassagePanel events={this.state.events} onCancel={this.cancelMassage} />
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
