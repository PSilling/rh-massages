// react imports
import React, { Component } from "react";

// module imports
import { Table } from "reactstrap";

// component imports
import FacilityModal from "../components/modals/FacilityModal";
import FacilityRow from "../components/rows/FacilityRow";
import InfoAlert from "../components/util/InfoAlert";
import UnauthorizedMessage from "../components/util/UnauthorizedMessage";
import "../styles/components/loader.css";

// util imports
import _t from "../util/Translations";
import Auth from "../util/Auth";
import Fetch from "../util/Fetch";
import Util from "../util/Util";

/**
 * Main view table component for Facility management. Visible only administrator priviledges.
 */
class Facilities extends Component {
  state = { facilities: [], modalActive: false, editId: -1, loading: true };

  alertMessage = _t.translate("On this page you can manage facilities in which massages take place.");

  componentDidMount() {
    this.getFacilities();
    Fetch.WEBSOCKET_CALLBACKS.facility = this.facilityCallback;
    Fetch.tryWebSocketSend("ADD_Facility");
  }

  componentWillUnmount() {
    Fetch.WEBSOCKET_CALLBACKS.facility = null;
    Fetch.tryWebSocketSend("REMOVE_Facility");
  }

  getFacilities = () => {
    Fetch.get(Util.FACILITIES_URL, json => {
      if (json !== undefined) {
        this.setState({ facilities: json, loading: false });
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
        console.log(`Invalid WebSocket operation. Found: ${operation}.`);  /* eslint-disable-line */
        break;
    }

    this.setState(() => ({ facilities }));
  };

  closeAlert = () => {
    localStorage.setItem("closeFacilitiesAlert", true);
    this.setState(prevState => ({ loading: prevState.loading }));
  };

  toggleModal = id => {
    this.setState(prevState => ({ modalActive: !prevState.modalActive, editId: id }));
  };

  render() {
    if (!Auth.isAdmin()) {
      return <UnauthorizedMessage title={_t.translate("Facilities")} />;
    }

    return (
      <div>
        {!localStorage.getItem("closeFacilitiesAlert") && (
          <InfoAlert onClose={this.closeAlert}>{this.alertMessage}</InfoAlert>
        )}
        <h1>
          {this.state.loading && <div className="loader float-right" />}
          {_t.translate("Facilities")}
        </h1>
        <Table hover responsive striped size="sm">
          <thead>
            <tr>
              <th scope="col">{_t.translate("Name")}</th>
              <th scope="col">
                <FacilityModal
                  active={this.state.modalActive}
                  facility={this.state.editId === -1 ? null : this.state.facilities[this.state.editId]}
                  onToggle={() => this.toggleModal(-1)}
                />
              </th>
            </tr>
          </thead>
          {this.state.facilities !== undefined && this.state.facilities.length > 0 ? (
            <tbody>
              {this.state.facilities.map((item, index) => (
                <FacilityRow
                  key={item.id}
                  facility={item}
                  onEdit={() => this.toggleModal(index)}
                  onDelete={() => Fetch.delete(Util.FACILITIES_URL + item.id)}
                />
              ))}
            </tbody>
          ) : (
            <tbody>
              <tr>
                <th colSpan="2" scope="row">
                  {_t.translate("None")}
                </th>
              </tr>
            </tbody>
          )}
        </Table>
      </div>
    );
  }
}

export default Facilities;
