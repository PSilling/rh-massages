// react imports
import React, { Component } from "react";
import PropTypes from "prop-types";

// module imports
import { Button, Nav, Row, Col, FormGroup, Label, Input, Modal, ModalBody } from "reactstrap";
import moment from "moment";

// component imports
import ModalActions from "../buttons/ModalActions";
import LabeledDatetime from "../formitems/LabeledDatetime";
import LabeledInput from "../formitems/LabeledInput";
import Tab from "../navs/Tab";
import TooltipButton from "../buttons/TooltipButton";
import TooltipGroup from "../util/TooltipGroup";

// util imports
import _t from "../../util/Translations";
import Fetch from "../../util/Fetch";
import Util from "../../util/Util";

/**
 * Input Modal for creating multiple rules of Massages at once.
 */
class MassageBatchAddModal extends Component {
  state = {
    rules: [
      {
        days: [],
        weeks: "1",
        masseuse: "",
        startDate: moment(),
        startTime: moment("08:00", "HH:mm"),
        massageDuration: moment("00:30", "HH:mm"),
        massagesPerDay: "10",
        normalPause: moment("00:10", "HH:mm"),
        bigPause: moment("01:00", "HH:mm"),
        bigPauseAfter: "5"
      }
    ],
    index: 0
  };

  weekdays = _t.translate("Monday_Tuesday_Wednesday_Thursday_Friday_Saturday_Sunday").split("_");

  yesterday = moment().subtract(1, "day");

  tooltipTargets = Util.getTooltipTargets(4);

  tooltipLabels = [
    _t.translate("Import previously downloaded rules"),
    _t.translate("The days on which the defined massages should be created"),
    _t.translate("Information about the massages that should be created"),
    _t.translate("Information about breaks between individual massages")
  ];

  getMinutes = from => 60 * from.get("hour", "hours") + from.get("minute", "minutes");

  changeStartDate = date => {
    if (typeof date === "string") {
      return;
    }

    this.setState(prevState => {
      const rules = [...prevState.rules];
      rules[prevState.index].startDate = date.isBefore(
        moment()
          .startOf("minute")
          .subtract(1, "days")
      )
        ? moment()
        : date;
      return rules;
    });
  };

  changeStartTime = time => {
    if (typeof time === "string") {
      return;
    }

    this.setState(prevState => {
      const rules = [...prevState.rules];
      rules[prevState.index].startTime = time;
      return rules;
    });
  };

  changeNormalPause = duration => {
    if (typeof duration === "string") {
      return;
    }
    this.setState(prevState => {
      const rules = [...prevState.rules];
      rules[prevState.index].normalPause = duration;
      return rules;
    });
  };

  changeBigPause = duration => {
    if (typeof duration === "string") {
      return;
    }
    this.setState(prevState => {
      const rules = [...prevState.rules];
      rules[prevState.index].bigPause = duration;
      return rules;
    });
  };

  changeMassageDuration = duration => {
    if (typeof duration === "string") {
      return;
    }
    this.setState(prevState => {
      const rules = [...prevState.rules];
      rules[prevState.index].massageDuration = duration;
      return rules;
    });
  };

  changeMassagesPerDay = event => {
    if (
      Util.isEmpty(event.target.value) ||
      parseInt(event.target.value, 10) < 1 ||
      parseInt(event.target.value, 10) > 100
    ) {
      return;
    }
    const { value } = event.target;

    this.setState(prevState => {
      const rules = [...prevState.rules];
      if (parseInt(rules[prevState.index].bigPauseAfter, 10) > parseInt(value, 10)) {
        rules[prevState.index].bigPauseAfter = value;
      }

      rules[prevState.index].massagesPerDay = value;

      return rules;
    });
  };

  changeBigPauseAfter = event => {
    if (
      Util.isEmpty(event.target.value) ||
      parseInt(event.target.value, 10) < 1 ||
      parseInt(event.target.value, 10) > 100
    ) {
      return;
    }
    const { value } = event.target;
    this.setState(prevState => {
      const rules = [...prevState.rules];
      rules[prevState.index].bigPauseAfter = value;
      return rules;
    });
  };

  changeWeeks = event => {
    if (
      Util.isEmpty(event.target.value) ||
      parseInt(event.target.value, 10) < 1 ||
      parseInt(event.target.value, 10) > 54
    ) {
      return;
    }
    const { value } = event.target;
    this.setState(prevState => {
      const rules = [...prevState.rules];
      rules[prevState.index].weeks = value;
      return rules;
    });
  };

  changeMasseuse = event => {
    const { value } = event.target;
    this.setState(prevState => {
      const rules = [...prevState.rules];
      rules[prevState.index].masseuse = value;
      return rules;
    });
  };

  changeTabIndex = index => {
    this.setState({ index });
  };

  addRule = () => {
    this.setState(prevState => {
      const rules = [...prevState.rules];
      rules.push({
        days: [],
        weeks: "1",
        masseuse: "",
        startDate: moment(),
        startTime: moment("08:00", "HH:mm"),
        massageDuration: moment("00:30", "HH:mm"),
        massagesPerDay: "10",
        normalPause: moment("00:10", "HH:mm"),
        bigPause: moment("01:00", "HH:mm"),
        bigPauseAfter: "5"
      });
      return { rules, index: rules.length - 1 };
    });
  };

  removeRule = index => {
    this.setState(prevState => {
      const rules = [...prevState.rules];
      rules.splice(index, 1);
      return {
        rules,
        index: prevState.index > rules.length - 1 ? rules.length - 1 : prevState.index
      };
    });
  };

  changeDays = (event, day) => {
    const { checked } = event.target;
    this.setState(prevState => {
      const rules = [...prevState.rules];
      const days = [...prevState.rules[prevState.index].days];
      if (checked) {
        days.push(day);
      } else {
        days.splice(days.indexOf(day), 1);
      }
      rules[prevState.index].days = days;
      return rules;
    });
  };

  /**
   * Calculates the date/ending based on day offset.
   */
  getDate = (isEnding, index, day, count) => {
    const date = moment(this.state.rules[index].startDate)
      .add(day, "days")
      .startOf("day");

    const startMinutes = this.getMinutes(this.state.rules[index].startTime);
    const massageMinutes = this.getMinutes(this.state.rules[index].massageDuration);
    const pauseMinutes = this.getMinutes(this.state.rules[index].normalPause);
    const bigPauseMinutes =
      count >= this.state.rules[index].bigPauseAfter
        ? this.getMinutes(this.state.rules[index].bigPause) - pauseMinutes
        : 0;

    let minutes = startMinutes + bigPauseMinutes + (massageMinutes + pauseMinutes) * count;
    if (isEnding) {
      minutes += massageMinutes;
    }
    return moment(date).add(minutes, "minutes");
  };

  /**
   * Creates all Massages generated using the rules.
   */
  addMassages = () => {
    const postArray = [];

    let informed = false;
    for (let i = 0; i < this.state.rules.length; i++) {
      if (Util.isEmpty(this.state.rules[i].masseuse)) {
        Util.notify("error", _t.translate("Masseuse is required!"), _t.translate("Rule #") + (i + 1));
        return;
      }
      if (this.state.rules[i].days.length === 0) {
        Util.notify("error", _t.translate("At least one repeat day is required!"), _t.translate("Rule #") + (i + 1));
        return;
      }
    }

    for (let i = 0; i < this.state.rules.length; i++) {
      for (let j = 0; j < this.state.rules[i].weeks * 7; j++) {
        if (
          this.state.rules[i].days.indexOf(
            moment(this.state.rules[i].startDate)
              .add(j, "days")
              .format("dddd")
          ) !== -1
        ) {
          for (let k = 0; k < this.state.rules[i].massagesPerDay; k++) {
            if (this.getDate(false, i, j, k).isAfter(moment())) {
              if (!informed) {
                Util.notify(
                  "warning",
                  _t.translate(
                    "Not all massages were edited as in some cases the new date would have been before now."
                  ),
                  _t.translate("Warning")
                );
                informed = true;
              }
              postArray.push({
                date: this.getDate(false, i, j, k).toDate(),
                ending: this.getDate(true, i, j, k).toDate(),
                masseuse: this.state.rules[i].masseuse,
                client: null,
                facility: { id: this.props.facilityId }
              });
            }
          }
        }
      }
    }
    if (postArray.length > 0) {
      Fetch.post(Util.MASSAGES_URL, postArray, () => {
        this.props.getCallback();
        this.props.onToggle(true);
      });
    }
  };

  /**
   * Checks all rule values in the imported file. Any incorrectly supplied values
   * are replaced by default rule values.
   */
  handleImportedFile = rules => {
    if (!Array.isArray(rules) || rules.length === 0) {
      Util.notify("error", "", _t.translate("Invalid import file."));
      return null;
    }

    for (let i = 0; i < rules.length; i++) {
      if (!Array.isArray(rules[i].days)) {
        rules[i].days = [];
      }
      if (Util.isEmpty(rules[i].weeks) || parseInt(rules[i].weeks, 10) < 1 || parseInt(rules[i].weeks, 10) > 54) {
        rules[i].weeks = "1";
      }
      if (Util.isEmpty(rules[i].masseuse)) {
        rules[i].masseuse = "";
      }
      if (
        Util.isEmpty(rules[i].startDate) ||
        moment(rules[i].startDate).isBefore(
          moment()
            .startOf("minute")
            .subtract(1, "days")
        )
      ) {
        rules[i].startDate = moment();
      } else {
        rules[i].startDate = moment(rules[i].startDate);
      }
      if (Util.isEmpty(rules[i].startTime)) {
        rules[i].startTime = moment("08:00", "HH:mm");
      } else {
        rules[i].startTime = moment(rules[i].startTime);
      }
      if (Util.isEmpty(rules[i].massageDuration)) {
        rules[i].massageDuration = moment("00:30", "HH:mm");
      } else {
        rules[i].massageDuration = moment(rules[i].massageDuration);
      }
      if (
        Util.isEmpty(rules[i].massagesPerDay) ||
        parseInt(rules[i].massagesPerDay, 10) < 1 ||
        parseInt(rules[i].massagesPerDay, 10) > 100
      ) {
        rules[i].massagesPerDay = "10";
      }
      if (Util.isEmpty(rules[i].normalPause)) {
        rules[i].normalPause = moment("00:10", "HH:mm");
      } else {
        rules[i].normalPause = moment(rules[i].normalPause);
      }
      if (Util.isEmpty(rules[i].bigPause)) {
        rules[i].bigPause = moment("01:00", "HH:mm");
      } else {
        rules[i].bigPause = moment(rules[i].bigPause);
      }
      if (
        Util.isEmpty(rules[i].bigPauseAfter) ||
        parseInt(rules[i].bigPauseAfter, 10) < 1 ||
        parseInt(rules[i].bigPauseAfter, 10) > 100
      ) {
        rules[i].bigPauseAfter = "5";
        if (parseInt(rules[i].bigPauseAfter, 10) < parseInt(rules[i].massagesPerDay, 10)) {
          rules[i].bigPauseAfter = rules[i].massagesPerDay;
        }
      }
    }
    return rules;
  };

  /**
   * Create a FileReader to read a given file to import rules.
   */
  importRules = event => {
    if (typeof window.FileReader !== "function") {
      Util.notify("error", "", _t.translate("FileReader API isn't supported by your browser."));
      return;
    }

    const fileReader = new FileReader();
    fileReader.onload = (reader => () => {
      const content = reader.result;
      const rules = this.handleImportedFile(JSON.parse(content));
      if (rules !== null) {
        this.setState({ rules });
      }
    })(fileReader);
    fileReader.readAsText(event.target.files[0]);
  };

  /**
   * Exports value of rules into massage_rules.json file for future importing.
   * The file is automatically downloaded.
   */
  exportRules = () => {
    const rulesJson = JSON.stringify(this.state.rules);
    const blob = new Blob([rulesJson], { type: "application/json" });

    const e = document.createEvent("MouseEvents");

    const a = document.createElement("a");
    a.download = "massage_rules.json";
    a.href = window.URL.createObjectURL(blob);
    a.dataset.downloadurl = ["application/json", a.download, a.href].join(":");
    e.initMouseEvent("click", true, false, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
    a.dispatchEvent(e);
  };

  handleModalKeyPress = event => {
    if (event.charCode === 13 && document.activeElement.tabIndex === -1) {
      this.addMassages();
    }
  };

  handleInputKeyPress = event => {
    if (event.key === "Enter") {
      this.addMassages();
    }
  };

  createInsides = () => (
    <ModalBody>
      <Row>
        <Col md="12">
          <h3>
            {_t.translate("Create Massages")}
            <div className="float-right">
              <Button id={this.tooltipTargets[0]} tag="label" outline htmlFor="fileImport">
                {_t.translate("Import")}
              </Button>
              <Input id="fileImport" className="d-none" type="file" onChange={this.importRules} accept=".json" />
              <TooltipButton
                className="ml-2 mb-2"
                onClick={this.exportRules}
                label={_t.translate("Export")}
                tooltip={_t.translate(
                  "Download a configuration file that you can use to import these rules at a later date"
                )}
              />
            </div>
          </h3>
          <hr />
        </Col>
      </Row>

      {this.state.rules.length > 0 ? (
        <div>
          <Row>
            <Col md="12">
              <Nav tabs className="mb-3">
                {this.state.rules.map((item, index) => (
                  <Tab
                    key={_t.translate("Rule #") + (index + 1)}
                    active={index === this.state.index}
                    label={_t.translate("Rule #") + (index + 1)}
                    onClick={() => this.changeTabIndex(index)}
                    onRemoveClick={() => this.removeRule(index)}
                  />
                ))}
                {this.state.rules.length < 5 && <Tab active={false} label="+" onClick={this.addRule} />}
              </Nav>
            </Col>
          </Row>

          <Row>
            <Col md="12">
              <Label id={this.tooltipTargets[1]}>{_t.translate("Repeat each")}</Label>
            </Col>
          </Row>
          <Row>
            <Col md="10">
              <FormGroup check inline>
                <div>
                  {this.weekdays.map(item => (
                    <Label key={item} for={`weekday${item}`}>
                      <Input
                        id={`weekday${item}`}
                        type="checkbox"
                        onChange={event => this.changeDays(event, item)}
                        onKeyPress={this.handleInputKeyPress}
                        checked={this.state.rules[this.state.index].days.indexOf(item) > -1}
                      />
                      <Label className="mr-2" for={`weekday${item}`}>
                        {item.toLowerCase()}
                      </Label>
                    </Label>
                  ))}
                </div>
              </FormGroup>
            </Col>
          </Row>

          <Row>
            <LabeledInput
              size="8"
              label={_t.translate("Masseur/Masseuse")}
              value={this.state.rules[this.state.index].masseuse}
              onChange={this.changeMasseuse}
              onEnterPress={this.addMassages}
              type="text"
              maxLength="64"
              options={this.props.masseuses}
              tooltip={_t.translate("The name of the masseur or massuese providing this rule's massages")}
            />
          </Row>

          <Row>
            <Col md="12">
              <Row>
                <LabeledDatetime
                  size="4"
                  label={_t.translate("Rule applies after")}
                  value={this.state.rules[this.state.index].startDate}
                  onChange={this.changeStartDate}
                  onEnterPress={this.addMassages}
                  timeFormat={false}
                  isValidDate={current => current.isAfter(this.yesterday)}
                  tooltip={_t.translate("The date after which the defined massages should be created")}
                />
                <LabeledInput
                  size="4"
                  label={_t.translate("Number of repetitions (weekly)")}
                  value={this.state.rules[this.state.index].weeks}
                  onChange={this.changeWeeks}
                  onEnterPress={this.addMassages}
                  type="number"
                  min="1"
                  max="54"
                  tooltip={_t.translate("The number of weeks (after the start date) this rule should be applied to")}
                />
              </Row>
            </Col>
          </Row>

          <Row>
            <Col md="12">
              <Label id={this.tooltipTargets[2]}>{_t.translate("Massages")}</Label>
            </Col>
          </Row>
          <Row>
            <Col md="12">
              <Row>
                <LabeledDatetime
                  size="3"
                  label={_t.translate("Shift start")}
                  value={this.state.rules[this.state.index].startTime}
                  onChange={this.changeStartTime}
                  onEnterPress={this.addMassages}
                  dateFormat={false}
                  tooltip={_t.translate("The time after which massages will start to be created each day")}
                />
                <LabeledDatetime
                  size="3"
                  label={_t.translate("Duration")}
                  value={this.state.rules[this.state.index].massageDuration}
                  onChange={this.changeMassageDuration}
                  onEnterPress={this.addMassages}
                  dateFormat={false}
                  tooltip={_t.translate("How long should each of the created massages be")}
                />
                <LabeledInput
                  size="3"
                  label={_t.translate("Number of massages per day")}
                  value={this.state.rules[this.state.index].massagesPerDay}
                  onChange={this.changeMassagesPerDay}
                  onEnterPress={this.addMassages}
                  type="number"
                  min="1"
                  max="100"
                  tooltip={_t.translate("How many massages should be created per day")}
                />
              </Row>
            </Col>
          </Row>

          <Row>
            <Col md="12">
              <Label id={this.tooltipTargets[3]}>{_t.translate("Breaks")}</Label>
            </Col>
          </Row>

          <Row>
            <Col md="12">
              <Row>
                <LabeledDatetime
                  size="3"
                  label={_t.translate("Normal break")}
                  value={this.state.rules[this.state.index].normalPause}
                  onChange={this.changeNormalPause}
                  onEnterPress={this.addMassages}
                  dateFormat={false}
                  tooltip={_t.translate(
                    "Length of the default break after each massage (not included the prelunch massage)"
                  )}
                />
                <LabeledDatetime
                  size="3"
                  label={_t.translate("Lunch break")}
                  value={this.state.rules[this.state.index].bigPause}
                  onChange={this.changeBigPause}
                  onEnterPress={this.addMassages}
                  dateFormat={false}
                  tooltip={_t.translate("Length of the lunch break")}
                />
                <LabeledInput
                  size="3"
                  label={_t.translate("Massages before lunch")}
                  value={this.state.rules[this.state.index].bigPauseAfter}
                  onChange={this.changeBigPauseAfter}
                  onEnterPress={this.addMassages}
                  type="number"
                  min="1"
                  max={this.state.rules[this.state.index].massagesPerDay}
                  tooltip={_t.translate("Number of massages before the lunch break")}
                />
              </Row>
            </Col>
            <TooltipGroup targets={this.tooltipTargets} labels={this.tooltipLabels} />
          </Row>
        </div>
      ) : (
        <Row>
          <Col md="2">
            <TooltipButton
              onClick={this.addRule}
              disabled={false}
              label={_t.translate("Create rule")}
              tooltip={_t.translate("Add a new creation macro")}
            />
          </Col>
        </Row>
      )}

      <ModalActions
        primaryLabel={_t.translate("Create")}
        onProceed={this.addMassages}
        onClose={() => this.props.onToggle(false)}
      />
    </ModalBody>
  );

  createModal = () =>
    this.props.withPortal ? (
      <Modal
        size="lg"
        isOpen
        toggle={() => this.props.onToggle(false)}
        tabIndex="-1"
        onKeyPress={this.handleModalKeyPress}
      >
        {this.createInsides()}
      </Modal>
    ) : (
      this.createInsides()
    );

  render() {
    const { facilityId, getCallback, onToggle, active, masseuses, withPortal, ...rest } = this.props;
    return (
      <span>
        <TooltipButton
          {...rest}
          onClick={() => this.props.onToggle(false)}
          label={_t.translate("Add more")}
          tooltip={_t.translate("Create multiple massages at once")}
        />

        {this.props.active && this.createModal()}
      </span>
    );
  }
}

MassageBatchAddModal.propTypes = {
  /** ID of the selected Facility */
  facilityId: PropTypes.number.isRequired,
  /** callback function for Massage list update */
  getCallback: PropTypes.func.isRequired,
  /** function called on modal toggle */
  onToggle: PropTypes.func.isRequired,
  /** whether the dialog should be shown */
  active: PropTypes.bool,
  /** unique Massage masseuses of the given Facility */
  masseuses: PropTypes.arrayOf(PropTypes.string),
  /** whether ModalContainer should be used; useful for testing to avoid portals */
  withPortal: PropTypes.bool
};

MassageBatchAddModal.defaultProps = {
  active: false,
  masseuses: [],
  withPortal: true
};

export default MassageBatchAddModal;
