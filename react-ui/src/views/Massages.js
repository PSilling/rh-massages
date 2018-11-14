// react imports
import React, { Component } from "react";

// module imports
import { Row, Col, Nav, Table } from "reactstrap";
import moment from "moment";

// component imports
import TooltipButton from "../components/buttons/TooltipButton";
import ConfirmationButton from "../components/buttons/ConfirmationButton";
import CalendarPanel from "../components/panels/CalendarPanel";
import InfoAlert from "../components/util/InfoAlert";
import MassageModal from "../components/modals/MassageModal";
import MassageBatchAddModal from "../components/modals/MassageBatchAddModal";
import PrintModal from "../components/modals/PrintModal";
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
    selected: [],
    index: 0,
    selectEvents: Auth.isAdmin(),
    editMassage: null,
    massageMinutes: 0,
    loading: true,
    modalActive: false,
    batchAddModalActive: false,
    events: [],
    freeOnly: false,
    printMassages: null,
    selectedDate: moment(),
    from: moment()
      .startOf("isoWeek")
      .subtract(7, "days"),
    to: moment()
      .endOf("isoWeek")
      .add(5, "days")
  };

  alertMessage =
    _t.translate("On this page you can view all upcoming massages. ") +
    _t.translate("To view details about or register a massage click on the appropriate event in the calendar below.");

  componentDidMount() {
    Util.clearAllIntervals();

    this.getFacilities();
    setInterval(() => {
      if (this.state.modalActive || this.state.batchAddModalActive) return;
      this.getMassages();
    }, Util.AUTO_REFRESH_TIME);
  }

  componentWillUnmount() {
    Util.clearAllIntervals();
  }

  getFacilities = () => {
    Fetch.get(Util.FACILITIES_URL, json => {
      this.setState({ facilities: json });
      this.getMassages();
    });
  };

  getMassages = () => {
    if (this.state.facilities !== undefined && this.state.facilities.length > 0) {
      Fetch.get(
        `${Util.FACILITIES_URL + this.state.facilities[this.state.index].id}/massages?free=${
          this.state.freeOnly
        }&from=${moment(this.state.from).unix() * 1000}&to=${moment(this.state.to).unix() * 1000}`,
        json => {
          if (json !== undefined && json.massages !== undefined && json.clientTime !== undefined) {
            this.updateEvents(json.massages, json.clientTime / 60000);
          }
        }
      );
    }
  };

  updateEvents = (massages, minutes) => {
    const events = [];
    const masseuses = [];

    let color;
    for (let i = 0; i < massages.length; i++) {
      if (Util.isEmpty(massages[i].client)) {
        color = "#2fad2f"; // Bootsrap warning color (buttons)
      } else if (Auth.getSub() === massages[i].client.sub) {
        color = "#ee9d2a"; // Bootsrap warning color (buttons)
      } else {
        color = "#d10a14"; // Bootsrap danger color (buttons)
      }
      events.push({ massage: massages[i], bgColor: color });

      if (masseuses.indexOf(massages[i].masseuse) === -1) {
        masseuses.push(massages[i].masseuse);
      }
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
        masseuses,
        massageMinutes: minutes,
        selected,
        loading: false
      };
    });
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
        selectedDate: moment(date)
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
        selectedDate: moment(date)
      });
    }
    setTimeout(() => this.getMassages(), 3);
  };

  changeTabIndex = index => {
    this.setState({ index, loading: true });
    setTimeout(() => this.getMassages(), 3);
  };

  setPrintMassages = massages => {
    this.setState({ printMassages: massages });
  };

  createPrintRows = () => {
    const rows = [];
    if (this.state.printMassages.length === 0) {
      rows.push(
        <tr key="info">
          <td colSpan="4">{_t.translate("None")}</td>
        </tr>
      );
    } else {
      for (let i = 0; i < this.state.printMassages.length; i++) {
        rows.push(
          <tr key={i}>
            <td>{moment(this.state.printMassages[i].date).format("L")}</td>
            <td>
              {`${moment(this.state.printMassages[i].date).format("HH:mm")}–${moment(
                this.state.printMassages[i].ending
              ).format("HH:mm")}`}
            </td>
            <td>{this.state.printMassages[i].masseuse}</td>
            <td>
              {Util.isEmpty(this.state.printMassages[i].client)
                ? _t.translate("Free")
                : Util.getContactInfo(this.state.printMassages[i].client)}
            </td>
          </tr>
        );
      }
    }
    return rows;
  };

  closeAlert = () => {
    localStorage.setItem("closeMassagesAlert", true);
    this.setState(prevState => ({ loading: prevState.loading }));
  };

  toggleModal = massage => {
    this.setState(prevState => ({ modalActive: !prevState.modalActive, editMassage: massage }));
  };

  toggleModalWithTime = slot => {
    if (moment(slot.start).isBefore(moment())) {
      Util.notify("warning", _t.translate("Cannot create a new massage in the past."), _t.translate("Warning"));
      return;
    }

    const exampleMassage = {
      generated: true,
      date: slot.start,
      ending: slot.end,
      masseuse: "",
      client: null,
      facility: { id: this.state.facilities[this.state.index].id }
    };
    setTimeout(
      () =>
        this.setState(prevState => ({
          modalActive: !prevState.modalActive,
          editMassage: exampleMassage
        })),
      1
    );
  };

  toggleBatchAddModal = deselect => {
    if (deselect) {
      this.setState(prevState => ({ selected: [], batchAddModalActive: !prevState.batchAddModalActive }));
    } else {
      this.setState(prevState => ({ batchAddModalActive: !prevState.batchAddModalActive }));
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
        <div className="my-3 no-print">
          {this.state.facilities !== undefined && this.state.facilities.length > 0 ? (
            <div>
              {this.state.loading && <div className="loader float-right" />}
              <h1>{_t.translate("Massages in ") + this.state.facilities[this.state.index].name}</h1>
              <Nav tabs className="mb-3">
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
                  {Auth.isAdmin() && (
                    <TooltipButton
                      className="mr-2"
                      label={_t.translate("Select")}
                      onClick={this.changeSelectEvents}
                      active={this.state.selectEvents}
                      tooltip={_t.translate("Select multiple massages for batch operations")}
                    />
                  )}
                  <TooltipButton
                    label={_t.translate("Just free")}
                    onClick={this.changeFreeOnly}
                    active={this.state.freeOnly}
                    tooltip={_t.translate("Display only free (green) massages")}
                  />
                </Col>
                <Col md="6" className="text-right">
                  <PrintModal
                    className="mr-2"
                    masseuses={this.state.masseuses}
                    facilityId={this.state.facilities[this.state.index].id}
                    date={this.state.selectedDate}
                    onPrint={this.setPrintMassages}
                  />
                  {Auth.isAdmin() && (
                    <span>
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
                        facilityId={this.state.facilities[this.state.index].id}
                        getCallback={this.getMassages}
                        onToggle={deselect => this.toggleBatchAddModal(deselect)}
                      />
                      <MassageModal
                        active={this.state.modalActive}
                        massage={this.state.editMassage}
                        masseuses={this.state.masseuses}
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
                onAssign={this.assignMassage}
                onCancel={this.cancelMassage}
                onAdd={this.toggleModalWithTime}
                onEdit={this.toggleModal}
                onDelete={this.deleteMassage}
                onDateChange={this.changeTimeRange}
                onSelect={this.handleEventSelect}
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
        {this.state.printMassages !== null && (
          <div className="print-only">
            <h1>{_t.translate("Schedule")}</h1>
            <Table>
              <thead>
                <tr>
                  <th scope="col">{_t.translate("Date")}</th>
                  <th scope="col">{_t.translate("Time")}</th>
                  <th scope="col">{_t.translate("Masseur/Masseuse")}</th>
                  <th scope="col" width="40%">
                    {_t.translate("Client")}
                  </th>
                </tr>
              </thead>
              <tbody>{this.createPrintRows()}</tbody>
            </Table>
          </div>
        )}
      </div>
    );
  }
}

export default Massages;
