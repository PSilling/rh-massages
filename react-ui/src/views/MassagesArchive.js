// react imports
import React, { Component } from "react";

// module imports
import moment from "moment";

// component imports
import BatchButton from "../components/buttons/BatchButton";
import BatchDeleteButton from "../components/buttons/BatchDeleteButton";
import CalendarPanel from "../components/panels/CalendarPanel";
import InfoAlert from "../components/util/InfoAlert";
import UnauthorizedMessage from "../components/util/UnauthorizedMessage";
import "../styles/components/loader.css";

// util imports
import Auth from "../util/Auth";
import _t from "../util/Translations";
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
    selectEvents: Auth.isAdmin(),
    from: moment()
      .startOf("month")
      .subtract(37, "days"),
    to: moment()
      .endOf("month")
      .add(37, "days")
  };

  alertMessage = _t.translate("On this page you can view finished, archived massages.");

  componentDidMount() {
    Util.clearAllIntervals();

    this.getMassages();
    setInterval(() => {
      this.getMassages();
    }, Util.AUTO_REFRESH_TIME);
  }

  getMassages = () => {
    Util.get(
      `${Util.MASSAGES_URL}old?from=${moment(this.state.from).unix() * 1000}&to=${moment(this.state.to).unix() * 1000}`,
      json => {
        if (json !== undefined && json.massages !== undefined) {
          this.updateEvents(json.massages);
        }
      }
    );
  };

  updateEvents = massages => {
    const events = [];

    let color;

    for (let i = 0; i < massages.length; i++) {
      if (Util.isEmpty(massages[i].client)) {
        color = "#00ac46"; // Bootsrap warning color (buttons)
      } else {
        color = "#e2001d"; // Bootsrap danger color (buttons)
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
    Util.delete(`${Util.MASSAGES_URL}?ids=${id}`, this.getMassages);
  };

  deleteSelectedMassages = () => {
    let idString = "?";
    for (let i = 0; i < this.state.selected.length; i++) {
      if (idString.length > 2000) {
        break;
      }
      idString += `ids=${this.state.selected[i].id}&`;
    }
    Util.delete(Util.MASSAGES_URL + idString, () => {
      this.setState({ selected: [] });
      this.getMassages();
    });
  };

  /**
   * Removes all old Massages from the server.
   */
  deleteAllMassages = () => {
    Util.get(
      `${Util.MASSAGES_URL}old?&from=${moment(this.state.from).unix() * 1000}&to=${moment(this.state.to)
        .add(1, "days")
        .unix() * 1000}`,
      json => {
        if (json === undefined || json.massages === undefined || json.massages.length === 0) {
          return;
        }
        let idString = "?";
        for (let i = 0; i < json.massages.length; i++) {
          if (idString.length > 2000) {
            Util.delete(Util.MASSAGES_URL + idString, this.getMassages);
            idString = "?";
          }
          idString += `ids=${json.massages[i].id}&`;
        }
        Util.delete(Util.MASSAGES_URL + idString, this.getMassages);
      }
    );
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

  changeSelectEvents = () => {
    this.setState(prevState => ({ selected: [], selectEvents: !prevState.selectEvents }));
  };

  changeTimeRange = (date, view) => {
    if (view === "month") {
      this.setState({
        from: moment(date)
          .startOf("month")
          .subtract(37, "days"),
        to: moment(date)
          .endOf("month")
          .add(37, "days"),
        loading: true,
        selected: []
      });
    } else {
      this.setState({
        from: moment(date)
          .startOf("isoWeek")
          .subtract(7, "days"),
        to: moment(date)
          .endOf("isoWeek")
          .add(5, "days"),
        loading: true,
        selected: []
      });
    }
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
      <div>
        {!localStorage.getItem("closeArchiveAlert") ? (
          <InfoAlert onClose={this.closeAlert}>{this.alertMessage}</InfoAlert>
        ) : (
          ""
        )}
        <h1>
          {this.state.loading ? <div className="loader pull-right" /> : ""}
          {_t.translate("Massages Archive")}
        </h1>
        <hr />
        <div className="row" style={{ marginBottom: "15px" }}>
          <div className="col-md-6">
            <BatchButton
              label={_t.translate("Select")}
              onClick={this.changeSelectEvents}
              active={this.state.selectEvents}
            />
          </div>
          <div className="col-md-6 text-right">
            <BatchDeleteButton
              onDelete={this.deleteSelectedMassages}
              label={_t.translate("Delete selected")}
              disabled={this.state.selected.length === 0}
            />
            <span style={{ marginLeft: "5px" }}>
              <BatchDeleteButton onDelete={this.deleteAllMassages} label={_t.translate("Delete all")} />
            </span>
          </div>
        </div>
        <CalendarPanel
          events={this.state.events}
          selectEvents={this.state.selectEvents}
          selected={this.state.selected}
          allowEditation={false}
          onDelete={this.deleteMassage}
          onDateChange={this.changeTimeRange}
          onSelect={this.handleEventSelect}
        />
      </div>
    );
  }
}

export default MassagesArchive;
