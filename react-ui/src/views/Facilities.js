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
import Auth from "../util/Auth";
import _t from "../util/Translations";
import Util from "../util/Util";

/**
 * Main view table component for Facility management. Viewable only for administrators.
 */
class Facilities extends Component {
  state = { facilities: [], modalActive: false, editId: -1, loading: true };

  alertMessage = _t.translate("On this page you can manage facilities in which massages take place.");

  componentDidMount() {
    Util.clearAllIntervals();

    this.getFacilities();
    setInterval(() => {
      if (this.state.modalActive) return;
      this.getFacilities();
    }, Util.AUTO_REFRESH_TIME * 30);
  }

  getFacilities = () => {
    Util.get(Util.FACILITIES_URL, json => {
      this.setState({ facilities: json, loading: false });
    });
  };

  deleteFacility = id => {
    Util.delete(Util.FACILITIES_URL + id, this.getFacilities);
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
        <hr />
        <Table hover responsive striped size="sm">
          <thead>
            <tr>
              <th scope="col">{_t.translate("Name")}</th>
              <th scope="col">
                <FacilityModal
                  active={this.state.modalActive}
                  facility={this.state.editId === -1 ? null : this.state.facilities[this.state.editId]}
                  getCallback={this.getFacilities}
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
                  onDelete={() => this.deleteFacility(item.id)}
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
