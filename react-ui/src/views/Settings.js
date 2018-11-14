// react imports
import React, { Component } from "react";

// module imports
import { Row, Col, FormGroup, Label, Input, Tooltip } from "reactstrap";

// component imports
import InfoAlert from "../components/util/InfoAlert";
import "../styles/components/loader.css";

// util imports
import _t from "../util/Translations";
import Auth from "../util/Auth";
import Fetch from "../util/Fetch";
import Util from "../util/Util";

/**
 * View containing portal and user settings.
 */
class Settings extends Component {
  state = { notify: false, loading: true, tooltipOpen: false };

  alertMessage =
    _t.translate("On this page you can manage your local user settings. ") +
    _t.translate("You can also use this page to access our repository on GitHub.");

  tooltipTarget = `Tooltip${Util.tooltipCount++}`;

  componentDidMount() {
    Util.clearAllIntervals();

    this.getSettings();
    setInterval(() => {
      this.getSettings();
    }, Util.AUTO_REFRESH_TIME * 600);
  }

  getSettings = () => {
    Fetch.get(`${Util.CLIENTS_URL}my/subscribed`, json => {
      this.setState({ notify: json, loading: false });
    });
  };

  changeNotify = event => {
    Auth.subscribed = event.target.checked;
    Fetch.put(
      Util.CLIENTS_URL,
      Auth.getClient(),
      () => {
        this.setState({ notify: Auth.subscribed });
      },
      false
    );
  };

  closeAlert = () => {
    localStorage.setItem("closeSettingsAlert", true);
    this.setState(prevState => ({ loading: prevState.loading }));
  };

  toggleTooltip = () => {
    this.setState(prevState => ({ tooltipOpen: !prevState.tooltipOpen }));
  };

  render() {
    return (
      <div className="my-3">
        {!localStorage.getItem("closeSettingsAlert") && (
          <InfoAlert onClose={this.closeAlert}>{this.alertMessage}</InfoAlert>
        )}
        <h1>
          {this.state.loading && <div className="loader float-right" />}
          {_t.translate("Settings")}
        </h1>
        <hr />
        <h3>{_t.translate("User settings")}</h3>
        <Row>
          <Col md="12">
            <FormGroup check inline>
              <Label for="notifyInput">
                <Input id="notifyInput" type="checkbox" onChange={this.changeNotify} checked={this.state.notify} />
                {_t.translate("I want to recieve information about ")}
                <span style={{ borderBottom: "1px dotted", cursor: "pointer" }} id={this.tooltipTarget}>
                  {_t.translate("massage changes")}
                </span>
              </Label>
            </FormGroup>
            <Tooltip isOpen={this.state.tooltipOpen} target={this.tooltipTarget} toggle={this.toggleTooltip}>
              {_t.translate("Scheduling of new and cancellation of assigned massages")}
            </Tooltip>
          </Col>
        </Row>

        <h3>{_t.translate("About")}</h3>
        <Row>
          <Col md="12">
            {_t.translate("Visit our ")}
            <a href={Util.GITHUB_URL} target="_blank" rel="noreferrer noopener">
              GitHub
            </a>
            &nbsp;
            <del>
              {_t.translate(" and our ")}
              <a href={`${Util.GITHUB_URL}wiki`} target="_blank" rel="noreferrer noopener">
                wiki
              </a>
            </del>
            ! (WIP)
          </Col>
        </Row>
        <Row>
          <Col md="12">
            {_t.translate("Report issues ")}
            <a href={`${Util.GITHUB_URL}issues`} target="_blank" rel="noreferrer noopener">
              {_t.translate("here")}
            </a>
            .
          </Col>
        </Row>
      </div>
    );
  }
}

export default Settings;
