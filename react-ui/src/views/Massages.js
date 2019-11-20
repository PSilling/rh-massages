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
import MassageScheduleModal from "../components/modals/MassageScheduleModal";
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
    clients: [],
    clientTooltips: [],
    facilities: [],
    events: [],
    masseuses: [],
    masseuseTooltips: [],
    selected: [],
    index: 0,
    selectEvents: false,
    editMassage: null,
    massageMinutes: {},
    loading: true,
    modalActive: false,
    batchAddModalActive: false,
    activeEventTooltip: null
  };

  alertMessage =
    _t.translate("On this page you can view all upcoming massages. ") +
    _t.translate("To view details about or register a massage click on the appropriate event in the calendar below.");

  closeAlertStorageString = `closeMassagesAlert-${Auth.getSub()}`;

  componentDidMount() {
    this.getUsers();
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

  getUsers = () => {
    Fetch.get(`${Util.CLIENTS_URL}`, json => {
      if (json !== undefined) {
        const clients = [];
        const clientTooltips = [];
        const masseuses = [];
        const masseuseTooltips = [];

        for (let i = 0; i < json.length; i++) {
          if (json[i].masseur) {
            masseuses.push(json[i]);
            masseuseTooltips.push(Util.getContactInfo(json[i]));
          } else {
            clients.push(json[i]);
            clientTooltips.push(Util.getContactInfo(json[i]));
          }
        }

        this.setState({ clients, clientTooltips, masseuses, masseuseTooltips });
      }
    });
  };

  getFacilities = () => {
    Fetch.get(Util.FACILITIES_URL, json => {
      this.setState({ facilities: json });
      this.getMassages();
    });
  };

  getMassages = (index = this.state.index) => {
    if (this.state.facilities !== undefined && this.state.facilities.length > 0) {
      Fetch.get(`${Util.FACILITIES_URL + this.state.facilities[index].id}/massages`, json => {
        if (json !== undefined && json.massages !== undefined && json.clientTimes !== undefined) {
          this.updateEvents(json.massages, json.clientTimes);
        }
      });
    }
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
    if (massage.facility.id !== this.state.facilities[this.state.index].id) {
      return;
    }

    const resultState = {
      events: [...this.state.events],
      selected: [],
      massageMinutes: this.state.massageMinutes,
      index: Util.findInArrayByMassageId(this.state.events, massage.id)
    };

    switch (operation) {
      case Fetch.OPERATION_ADD:
        this.handleAddOperation(resultState, massage);
        break;
      case Fetch.OPERATION_CHANGE:
        this.handleRemoveOperation(resultState, massage);
        this.handleAddOperation(resultState, massage);
        break;
      case Fetch.OPERATION_REMOVE:
        this.handleRemoveOperation(resultState, massage);
        break;
      default:
        console.log(`Invalid WebSocket operation. Found: ${operation}.`); /* eslint-disable-line */
        break;
    }

    this.setState(() => ({
      events: resultState.events,
      massageMinutes: resultState.massageMinutes,
      selected: resultState.selected
    }));
  };

  clientCallback = (operation, client) => {
    if (client.sub === Auth.getSub() && operation === Fetch.OPERATION_REMOVE) {
      Auth.keycloak.logout();
    }

    const clients = [...this.state.clients];
    const clientTooltips = [...this.state.clientTooltips];
    const masseuses = [...this.state.masseuses];
    const masseuseTooltips = [...this.state.masseuseTooltips];

    const clientsIndex = Util.findInArrayById(clients, client.sub, "sub");
    const masseusesIndex = Util.findInArrayById(masseuses, client.sub, "sub");

    switch (operation) {
      case Fetch.OPERATION_ADD:
        if (client.masseur) {
          masseuses.push(client);
          masseuseTooltips.push(Util.getContactInfo(client));
        } else {
          clients.push(client);
          clientTooltips.push(Util.getContactInfo(client));
        }
        break;
      case Fetch.OPERATION_CHANGE:
        if (masseusesIndex === -1 && client.masseur) {
          clients.splice(clientsIndex, 1);
          clientTooltips.splice(clientsIndex, 1);
          masseuses.push(client);
          masseuseTooltips.push(Util.getContactInfo(client));
        } else if (client.masseur) {
          masseuses[masseusesIndex] = client;
          masseuseTooltips[masseusesIndex] = Util.getContactInfo(client);
        } else if (clientsIndex === -1) {
          clients.push(client);
          clientTooltips.push(Util.getContactInfo(client));
          masseuses.splice(masseusesIndex, 1);
          masseuseTooltips.splice(masseusesIndex, 1);
        } else {
          clients[clientsIndex] = client;
          clientTooltips[clientsIndex] = Util.getContactInfo(client);
        }
        break;
      case Fetch.OPERATION_REMOVE:
        if (client.masseur) {
          if (masseusesIndex !== -1) {
            masseuses.splice(masseusesIndex, 1);
            masseuseTooltips.splice(masseusesIndex, 1);
          }
        } else if (clientsIndex !== -1) {
          clients.splice(clientsIndex, 1);
          clientTooltips.splice(clientsIndex, 1);
        }
        break;
      default:
        console.log(`Invalid WebSocket operation. Found: ${operation}.`); /* eslint-disable-line */
        break;
    }

    this.setState(() => ({ clients, clientTooltips, masseuses, masseuseTooltips }));
  };

  updateEvents = (massages, timesPerMonth) => {
    const events = [];

    for (let i = 0; i < massages.length; i++) {
      events.push({ massage: massages[i], bgColor: this.getBgColor(massages[i]) });
    }

    Object.keys(timesPerMonth).forEach(key => {
      timesPerMonth[key] /= 60000; // convert millisecond times to minute times
    });

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
        massageMinutes: timesPerMonth,
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

  getBgColor = massage => {
    if (Util.isEmpty(massage.client)) {
      return Util.SUCCESS_COLOR;
    }
    if (Auth.getSub() === massage.client.sub) {
      return Util.WARNING_COLOR;
    }
    return Util.ERROR_COLOR;
  };

  getMinutesChange = massage => {
    if (!Util.isEmpty(massage.client) && Auth.getSub() === massage.client.sub) {
      return moment.duration(moment(massage.ending).diff(massage.date)).asMinutes();
    }

    return 0;
  };

  handleMassageMinutesChange = (massageMinutes, changedMassage, addChange) => {
    const minuteChange = addChange ? this.getMinutesChange(changedMassage) : -this.getMinutesChange(changedMassage);
    if (minuteChange === 0) {
      return;
    }

    const month = moment(changedMassage.date).format("MM-YYYY");
    if (Object.hasOwnProperty.call(massageMinutes, month)) {
      massageMinutes[month] += minuteChange;
    } else {
      massageMinutes[month] = minuteChange;
    }

    if (massageMinutes[month] <= 0) {
      delete massageMinutes[month];
    }
  };

  handleAddOperation = (resultState, massage) => {
    if (this.state.facilities[this.state.index].id === massage.facility.id) {
      this.handleMassageMinutesChange(resultState.massageMinutes, massage, true);
      resultState.events.push({ massage, bgColor: this.getBgColor(massage) });
    }
  };

  handleRemoveOperation = (resultState, massage) => {
    if (resultState.index !== -1) {
      this.handleMassageMinutesChange(resultState.massageMinutes, resultState.events[resultState.index].massage, false);
      resultState.selected = [...this.state.selected];

      const selectedIndex = Util.findInArrayById(resultState.selected, massage.id);
      if (selectedIndex !== 1) {
        resultState.selected.splice(selectedIndex, 1);
      }
      resultState.events.splice(resultState.index, 1);
    }
  };

  assignMassage = massage => {
    Fetch.put(Util.MASSAGES_URL, [
      {
        id: massage.id,
        date: massage.date,
        ending: massage.ending,
        masseuse: massage.masseuse,
        client: Auth.getClient(),
        facility: massage.facility
      }
    ]);
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
      () => {},
      true,
      null,
      Util.isEmpty(massage.client) || Auth.getSub() === massage.client.sub ? null : {}
    );
    this.setState({ activeEventTooltip: null });
  };

  deleteMassage = id => {
    Fetch.delete(`${Util.MASSAGES_URL}?ids=${id}`);
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

  /**
   * Enables dynamic event selection for longer period of time.
   * If no massage is added using the given timeframe, removes the selection instead.
   */
  handleMultiEventSelect = (date, length) => {
    const start = moment(date)
      .clone()
      .startOf(length);
    const end = moment(date)
      .clone()
      .endOf(length);
    const massages = [];
    let removedCount = 0;
    let index;
    let massage;

    this.setState(prevState => {
      const selected = [...prevState.selected];

      for (let i = 0; i < prevState.events.length; i++) {
        ({ massage } = prevState.events[i]);

        if ((Auth.isAdmin() || Auth.getSub() === massage.masseuse.sub) && moment(massage.date).isBetween(start, end)) {
          massages.push(massage);

          index = Util.findInArrayById(selected, massage.id);
          if (index !== -1) {
            selected.splice(index, 1);
            removedCount++;
          }
        }
      }

      if (removedCount !== massages.length) {
        for (let i = 0; i < massages.length; i++) {
          selected.push(massages[i]);
        }
      }

      return { selected, activeEventTooltip: null };
    });
  };

  changeSelectEvents = () => {
    this.setState(prevState => ({ selected: [], selectEvents: !prevState.selectEvents }));
  };

  changeTabIndex = index => {
    this.setState({ index, loading: true, activeEventTooltip: null });
    this.getMassages(index);
  };

  closeAlert = () => {
    localStorage.setItem(this.closeAlertStorageString, true);
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
        {!localStorage.getItem(this.closeAlertStorageString) && (
          <InfoAlert onClose={this.closeAlert}>{this.alertMessage}</InfoAlert>
        )}
        <div className="my-3">
          {this.state.facilities !== undefined && this.state.facilities.length > 0 ? (
            <div>
              <Nav tabs className="mb-1 mt-4">
                {this.state.facilities.map((item, index) => (
                  <Tab
                    active={index === this.state.index}
                    label={item.name}
                    key={item.id}
                    onClick={() => this.changeTabIndex(index)}
                  />
                ))}
              </Nav>
              {Auth.isAdminOrMasseur() && (
                <Row className="mt-3">
                  <Col md="6">
                    <MassageModal
                      active={this.state.modalActive}
                      massage={this.state.editMassage}
                      clients={this.state.clients}
                      clientTooltips={this.state.clientTooltips}
                      masseuses={this.state.masseuses}
                      masseuseTooltips={this.state.masseuseTooltips}
                      facilityId={this.state.facilities[this.state.index].id}
                      onToggle={() => this.toggleModal(null)}
                    />
                    <MassageScheduleModal
                      className="ml-2"
                      active={this.state.batchAddModalActive}
                      masseuses={this.state.masseuses}
                      masseuseTooltips={this.state.masseuseTooltips}
                      facilityId={this.state.facilities[this.state.index].id}
                      onToggle={deselect => this.toggleBatchAddModal(deselect)}
                    />
                  </Col>
                  <Col md="6" className="text-right">
                    <TooltipButton
                      className="mr-2"
                      label={_t.translate("Select")}
                      onClick={this.changeSelectEvents}
                      active={this.state.selectEvents}
                      tooltip={_t.translate("Select multiple massages for batch operations")}
                    />
                    <ConfirmationButton
                      onConfirm={this.deleteSelectedMassages}
                      label={_t.translate("Delete selected")}
                      disabled={this.state.selected.length === 0}
                      tooltip={_t.translate("Delete selected massages")}
                    />
                  </Col>
                </Row>
              )}
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
                onSelect={this.handleEventSelect}
                onMultiSelect={this.handleMultiEventSelect}
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
