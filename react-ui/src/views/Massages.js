// react imports
import React, { Component } from "react";

// module imports
import { Row, Col, Nav } from "reactstrap";
import moment from "moment";

// component imports
import TooltipButton from "../components/buttons/TooltipButton";
import ConfirmationButton from "../components/buttons/ConfirmationButton";
import CalendarPanel from "../components/panels/CalendarPanel";
import InfoAlert from "../components/util/InfoAlert";
import MassageModal from "../components/modals/MassageModal";
import MassageBatchAddModal from "../components/modals/MassageBatchAddModal";
import Tab from "../components/navs/Tab";
import UnauthorizedMessage from "../components/util/UnauthorizedMessage";
import "../styles/components/loader.css";

// util imports
import _t from "../util/Translations";
import Auth from "../util/Auth";
import Fetch from "../util/Fetch";
import Util from "../util/Util";

/**
 * Main view calendar component for Massage management. Normal users can only view,
 * assign and cancel Massages. Supports batch CRUD operations.
 */
class Massages extends Component {
  state = {
    facilities: [],
    masseuses: [],
    masseuseNames: [],
    selected: [],
    index: 0,
    selectEvents: false,
    editMassage: null,
    massageMinutes: 0,
    loading: true,
    modalActive: false,
    batchAddModalActive: false,
    activeEventTooltip: null,
    events: [],
    freeOnly: false,
    from: moment()
      .startOf("isoWeek")
      .subtract(7, "days"),
    to: moment()
      .endOf("isoWeek")
      .add(5, "days"),
    mounted: false
  };

  alertMessage =
    _t.translate("On this page you can view all upcoming massages. ") +
    _t.translate("To view details about or register a massage click on the appropriate event in the calendar below.");

  componentDidMount() {
    Util.clearAllIntervals();

    this.setState({ mounted: true });
    this.getFacilities();
    this.getMasseuses();
    setInterval(() => {
      if (this.state.modalActive || this.state.batchAddModalActive || this.state.activeEventTooltip !== null) return;
      this.getMassages();
    }, Util.AUTO_REFRESH_TIME);
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

  getMasseuses = () => {
    Fetch.get(`${Util.CLIENTS_URL}masseuses`, json => {
      if (this.state.mounted && json !== undefined) {
        const masseuseNames = [];

        for (let i = 0; i < json.length; i++) {
          masseuseNames.push(`${json[i].name} ${json[i].surname}`);
        }

        this.setState({ masseuses: json, masseuseNames });
      }
    });
  };

  getMassages = () => {
    if (this.state.facilities !== undefined && this.state.facilities.length > 0) {
      Fetch.get(
        `${Util.FACILITIES_URL + this.state.facilities[this.state.index].id}/massages?free=${
          this.state.freeOnly
        }&from=${moment(this.state.from).unix() * 1000}&to=${moment(this.state.to).unix() * 1000}`,
        json => {
          if (
            this.state.mounted &&
            json !== undefined &&
            json.massages !== undefined &&
            json.clientTime !== undefined
          ) {
            this.updateEvents(json.massages, json.clientTime / 60000);
          }
        }
      );
    }
  };

  updateEvents = (massages, minutes) => {
    const events = [];

    let color;
    for (let i = 0; i < massages.length; i++) {
      if (Util.isEmpty(massages[i].client)) {
        color = Util.SUCCESS_COLOR;
      } else if (Auth.getSub() === massages[i].client.sub) {
        color = Util.WARNING_COLOR;
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

      return {
        events,
        massageMinutes: minutes,
        selected,
        loading: false
      };
    });
  };

  getMasseuse = () => {
    if (this.state.masseuses.length === 0) {
      return { sub: "", name: "", surname: "", email: "", subscribed: false, masseur: true };
    }

    if (!Auth.isAdmin()) {
      return Auth.getClient();
    }

    return this.state.masseuses[0];
  };

  assignMassage = massage => {
    Fetch.put(
      Util.MASSAGES_URL,
      [
        {
          id: massage.id,
          date: massage.date,
          ending: massage.ending,
          masseuse: massage.masseuse,
          client: Auth.getClient(),
          facility: massage.facility
        }
      ],
      this.getMassages
    );
    this.setState({ activeEventTooltip: null });
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
    this.setState({ activeEventTooltip: null });
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

  handleEventSelect = event => {
    if (event === null) {
      this.setState({ selected: [] });
      return;
    }

    if (!Auth.isAdmin() && event.massage.masseuse.sub !== Auth.getSub()) {
      Util.notify("warning", "", _t.translate("Cannot select an unowned massage!"));
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
        if (Auth.isAdmin() || Auth.getSub() === prevState.events[i].massage.masseuse.sub) {
          if (moment(prevState.events[i].massage.date).isBetween(start, end)) {
            selected.push(prevState.events[i].massage);
          }
        }
      }

      return { selected, activeEventTooltip: null };
    });
  };

  changeFreeOnly = () => {
    this.setState(prevState => ({ freeOnly: !prevState.freeOnly, loading: true }));
    setTimeout(() => this.getMassages(), 3);
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
        selected: [],
        activeEventTooltip: null
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
        selected: [],
        activeEventTooltip: null
      });
    }
    setTimeout(() => this.getMassages(), 3);
  };

  changeTabIndex = index => {
    this.setState({ index, loading: true, activeEventTooltip: null });
    setTimeout(() => this.getMassages(), 3);
  };

  closeAlert = () => {
    localStorage.setItem("closeMassagesAlert", true);
    this.setState(prevState => ({ loading: prevState.loading }));
  };

  changeTooltipActive = activeEventTooltip => {
    this.setState({ activeEventTooltip });
  };

  toggleModal = massage => {
    this.setState(prevState => ({
      modalActive: !prevState.modalActive,
      editMassage: massage,
      activeEventTooltip: null
    }));
  };

  toggleModalWithTime = slot => {
    if (moment(slot.start).isBefore(moment())) {
      Util.notify("warning", _t.translate("Cannot create a new massage in the past."), _t.translate("Warning"));
      return;
    }

    if (moment(slot.start).isSame(slot.end)) {
      return;
    }

    const exampleMassage = {
      generated: true,
      date: slot.start,
      ending: slot.end,
      masseuse: this.getMasseuse(),
      client: null,
      facility: { id: this.state.facilities[this.state.index].id }
    };

    setTimeout(
      () =>
        this.setState(prevState => ({
          modalActive: !prevState.modalActive,
          editMassage: exampleMassage,
          activeEventTooltip: null
        })),
      1
    );
  };

  toggleBatchAddModal = deselect => {
    if (deselect) {
      this.setState(prevState => ({
        selected: [],
        batchAddModalActive: !prevState.batchAddModalActive,
        activeEventTooltip: null
      }));
    } else {
      this.setState(prevState => ({ batchAddModalActive: !prevState.batchAddModalActive, activeEventTooltip: null }));
    }
  };

  render() {
    if (!Auth.isAuthenticated()) {
      return <UnauthorizedMessage title={_t.translate("Massages")} />;
    }

    return (
      <div>
        {!localStorage.getItem("closeMassagesAlert") && (
          <InfoAlert onClose={this.closeAlert}>{this.alertMessage}</InfoAlert>
        )}
        <div className="my-3">
          {this.state.facilities !== undefined && this.state.facilities.length > 0 ? (
            <div>
              {this.state.loading && <div className="loader float-right" style={{ marginTop: "-1.4em" }} />}
              <Nav tabs className="mb-3 mt-4">
                {this.state.facilities.map((item, index) => (
                  <Tab
                    active={index === this.state.index}
                    label={item.name}
                    key={item.id}
                    onClick={() => this.changeTabIndex(index)}
                  />
                ))}
              </Nav>
              <Row>
                <Col md="6">
                  <TooltipButton
                    label={_t.translate("Only free")}
                    onClick={this.changeFreeOnly}
                    active={this.state.freeOnly}
                    tooltip={_t.translate("Display only free massages")}
                  />
                </Col>
                <Col md="6" className="text-right">
                  {Auth.isAdminOrMasseur() && (
                    <span>
                      {Auth.isAdminOrMasseur() && (
                        <TooltipButton
                          className="mr-2"
                          label={_t.translate("Select")}
                          onClick={this.changeSelectEvents}
                          active={this.state.selectEvents}
                          tooltip={_t.translate("Select multiple massages for batch operations")}
                        />
                      )}
                      <ConfirmationButton
                        onConfirm={this.deleteSelectedMassages}
                        label={_t.translate("Delete selected")}
                        disabled={this.state.selected.length === 0}
                        tooltip={_t.translate("Delete selected massages")}
                      />
                      <MassageBatchAddModal
                        className="mx-2"
                        active={this.state.batchAddModalActive}
                        masseuses={this.state.masseuses}
                        masseuseNames={this.state.masseuseNames}
                        facilityId={this.state.facilities[this.state.index].id}
                        getCallback={this.getMassages}
                        onToggle={deselect => this.toggleBatchAddModal(deselect)}
                      />
                      <MassageModal
                        active={this.state.modalActive}
                        massage={this.state.editMassage}
                        masseuses={this.state.masseuses}
                        masseuseNames={this.state.masseuseNames}
                        facilityId={this.state.facilities[this.state.index].id}
                        getCallback={this.getMassages}
                        onToggle={() => this.toggleModal(null)}
                      />
                    </span>
                  )}
                </Col>
              </Row>
              <CalendarPanel
                events={this.state.events}
                selectEvents={this.state.selectEvents}
                selected={this.state.selected}
                massageMinutes={this.state.massageMinutes}
                activeEventTooltip={this.state.activeEventTooltip}
                onAssign={this.assignMassage}
                onCancel={this.cancelMassage}
                onAdd={this.toggleModalWithTime}
                onEdit={this.toggleModal}
                onDelete={this.deleteMassage}
                onDateChange={this.changeTimeRange}
                onSelect={this.handleEventSelect}
                onSelectDay={this.handleDayEventSelect}
                onTooltipTrigger={this.changeTooltipActive}
              />
            </div>
          ) : (
            <div>
              {this.state.loading && <div className="loader float-right" />}
              <h1>{_t.translate("Massages")}</h1>
              <hr />
            </div>
          )}
        </div>
      </div>
    );
  }
}

export default Massages;
