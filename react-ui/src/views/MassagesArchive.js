// react imports
import React, { Component } from "react";

// module imports
import { Row, Col } from "reactstrap";
import moment from "moment";

// component imports
import TooltipButton from "../components/buttons/TooltipButton";
import ConfirmationButton from "../components/buttons/ConfirmationButton";
import CalendarPanel from "../components/panels/CalendarPanel";
import InfoAlert from "../components/util/InfoAlert";
import UnauthorizedMessage from "../components/util/UnauthorizedMessage";
import "../styles/components/loader.css";

// util imports
import _t from "../util/Translations";
import Auth from "../util/Auth";
import Fetch from "../util/Fetch";
import Util from "../util/Util";

/**
 * Main view calendar component for Massage Archive management. Viewable only for administrators.
 * For archived Massages only removal is supported.
 */
class MassagesArchive extends Component {
  state = {
    events: [],
    loading: true,
    selected: [],
    selectEvents: false,
    from: moment()
      .startOf("month")
      .subtract(37, "days"),
    to: moment()
      .endOf("month")
      .add(37, "days")
  };

  alertMessage = _t.translate("On this page you can view finished, archived massages.");

  componentDidMount() {
    this.getMassages();
    Fetch.WEBSOCKET_CALLBACKS.client = this.clientCallback;
  }

  componentWillUnmount() {
    Fetch.WEBSOCKET_CALLBACKS.client = null;
  }

  getMassages = (from = this.state.from, to = this.state.to) => {
    Fetch.get(`${Util.MASSAGES_URL}old?from=${moment(from).unix() * 1000}&to=${moment(to).unix() * 1000}`, json => {
      if (json !== undefined && json.massages !== undefined) {
        this.updateEvents(json.massages);
      }
    });
  };

  clientCallback = (operation, client) => {
    if (client.sub === Auth.getSub() && Fetch.OPERATION_REMOVE) {
      Auth.keycloak.logout();
    }
  };

  updateEvents = massages => {
    const events = [];

    let color;

    for (let i = 0; i < massages.length; i++) {
      if (Util.isEmpty(massages[i].client)) {
        color = Util.SUCCESS_COLOR;
      } else {
        color = Util.ERROR_COLOR;
      }
      events.push({ massage: massages[i], bgColor: color });
    }

    this.setState(prevState => {
      const selected = [...prevState.selected];
      for (let i = 0; i < selected.length; i++) {
        if (Util.findInArrayById(massages, selected[i].id) === -1) {
          selected.splice(i, 1);
          i--;
        }
      }

      return { events, selected, loading: false };
    });
  };

  deleteMassage = id => {
    Fetch.delete(`${Util.MASSAGES_URL}?ids=${id}`, this.getMassages);
  };

  deleteSelectedMassages = () => {
    let idString = "?";
    for (let i = 0; i < this.state.selected.length; i++) {
      if (idString.length > 2000) {
        break;
      }
      idString += `ids=${this.state.selected[i].id}&`;
    }
    Fetch.delete(Util.MASSAGES_URL + idString, () => {
      this.setState({ selected: [] });
      this.getMassages();
    });
  };

  /**
   * Removes all old Massages from the server.
   */
  deleteAllMassages = () => {
    Fetch.get(`${Util.MASSAGES_URL}old?&from=${moment(0).unix() * 1000}&to=${moment().unix() * 1000}`, json => {
      if (json === undefined || json.massages === undefined) {
        return;
      }
      let idString = "?";
      for (let i = 0; i < json.massages.length; i++) {
        if (idString.length > 2000) {
          Fetch.delete(Util.MASSAGES_URL + idString, this.getMassages, true, {});
          idString = "?";
        }
        idString += `ids=${json.massages[i].id}&`;
      }
      Fetch.delete(Util.MASSAGES_URL + idString, this.getMassages, true, {});
    });
  };

  handleEventSelect = event => {
    if (event === null) {
      this.setState({ selected: [] });
      return;
    }

    this.setState(prevState => {
      const selected = [...prevState.selected];

      const index = Util.findInArrayById(selected, event.massage.id);
      if (index !== -1) {
        selected.splice(index, 1);
      } else {
        selected.push(event.massage);
      }
      return { selected };
    });
  };

  handleDayEventSelect = date => {
    const start = moment(date);
    const end = moment(date)
      .clone()
      .endOf("day");

    this.setState(prevState => {
      const selected = [...prevState.selected];

      for (let i = 0; i < prevState.events.length; i++) {
        if (moment(prevState.events[i].massage.date).isBetween(start, end)) {
          selected.push(prevState.events[i].massage);
        }
      }

      return { selected };
    });
  };

  changeSelectEvents = () => {
    this.setState(prevState => ({ selected: [], selectEvents: !prevState.selectEvents }));
  };

  changeTimeRange = (date, view) => {
    let from;
    let to;
    if (view === "month") {
      from = moment(date)
        .startOf("month")
        .subtract(37, "days");
      to = moment(date)
        .endOf("month")
        .add(37, "days");
    } else {
      from = moment(date)
        .startOf("isoWeek")
        .subtract(7, "days");
      to = moment(date)
        .endOf("isoWeek")
        .add(5, "days");
    }

    this.setState({
      from,
      to,
      loading: true,
      selected: []
    });

    this.getMassages(from, to);
  };

  closeAlert = () => {
    localStorage.setItem("closeArchiveAlert", true);
    this.setState(prevState => ({ loading: prevState.loading }));
  };

  render() {
    if (!Auth.isAdmin()) {
      return <UnauthorizedMessage title={_t.translate("Massages Archive")} />;
    }

    return (
      <div className="my-3">
        {!localStorage.getItem("closeArchiveAlert") && (
          <InfoAlert onClose={this.closeAlert}>{this.alertMessage}</InfoAlert>
        )}
        <h1>
          {this.state.loading && <div className="loader float-right" />}
          {_t.translate("Massages Archive")}
        </h1>
        <hr />
        <Row>
          <Col md="12" className="text-right">
            <TooltipButton
              label={_t.translate("Select")}
              onClick={this.changeSelectEvents}
              active={this.state.selectEvents}
              tooltip={_t.translate("Select multiple massages for batch operations")}
            />
            <ConfirmationButton
              className="mx-2"
              onConfirm={this.deleteSelectedMassages}
              label={_t.translate("Delete selected")}
              disabled={this.state.selected.length === 0}
              tooltip={_t.translate("Delete selected massages")}
            />
            <ConfirmationButton
              onConfirm={this.deleteAllMassages}
              label={_t.translate("Delete all")}
              tooltip={_t.translate("Clear the massage history")}
            />
          </Col>
        </Row>
        <CalendarPanel
          events={this.state.events}
          selectEvents={this.state.selectEvents}
          selected={this.state.selected}
          allowEditation={false}
          onDelete={this.deleteMassage}
          onDateChange={this.changeTimeRange}
          onSelect={this.handleEventSelect}
          onMultiSelect={this.handleDayEventSelect}
        />
      </div>
    );
  }
}

export default MassagesArchive;
