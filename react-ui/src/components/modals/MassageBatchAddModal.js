// react imports
import React, { Component } from "react";
import PropTypes from "prop-types";

// module imports
import { Button, Nav, Row, Col, FormGroup, Label, Input, Modal, ModalBody } from "reactstrap";
import moment from "moment";

// component imports
import ModalActions from "../buttons/ModalActions";
import LabeledDatetime from "../formitems/LabeledDatetime";
import Tab from "../navs/Tab";
import TooltipButton from "../buttons/TooltipButton";
import TooltipIconButton from "../iconbuttons/TooltipIconButton";
import TooltipGroup from "../util/TooltipGroup";

// util imports
import _t from "../../util/Translations";
import Auth from "../../util/Auth";
import Fetch from "../../util/Fetch";
import Util from "../../util/Util";

/**
 * Input Modal for creating multiple rules of Massages at once.
 */
class MassageBatchAddModal extends Component {
  state = {
    rules: [],
    settings: true,
    thisMonth: false,
    masseuse: { sub: "", name: "", surname: "", email: "", subscribed: false, masseur: true },
    massageDuration: moment("00:30", "HH:mm"),
    normalPause: moment("00:10", "HH:mm"),
    activeDropdown: -1,
    index: 0
  };

  weekdays = _t
    .translate("Monday_Tuesday_Wednesday_Thursday_Friday_Saturday_Sunday")
    .split("_")
    .splice(0, 5);

  radios = ["this month", "next month"];

  yesterday = moment().subtract(1, "day");

  tooltipTargets = Util.getTooltipTargets(4);

  tooltipLabels = [
    _t.translate("Import previously downloaded rules"),
    _t.translate("When set to another day, copies the schedule from it")
  ];

  componentDidMount() {
    this.setState({ masseuse: this.getMasseuse() });
  }

  getMasseuse = () => {
    if (this.props.masseuses.length === 0) {
      return { sub: "", name: "", surname: "", email: "", subscribed: false, masseur: true };
    }

    if (!Auth.isAdmin()) {
      return Auth.getClient();
    }

    return this.props.masseuses[0];
  };

  getBigPause = () => ({
    start: moment("12:00", "HH:mm"),
    end: moment("13:00", "HH:mm")
  });

  getRule = id => ({
    day: id === 0 ? "–" : this.weekdays[0],
    for: this.weekdays[id],
    disabled: false,
    startTime: moment("08:00", "HH:mm"),
    endTime: moment("18:00", "HH:mm"),
    bigPauses: [this.getBigPause()]
  });

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

  changeEndTime = time => {
    if (typeof time === "string") {
      return;
    }

    this.setState(prevState => {
      const rules = [...prevState.rules];
      rules[prevState.index].endTime = time;
      return rules;
    });
  };

  changeNormalPause = normalPause => {
    if (typeof normalPause === "string") {
      return;
    }
    this.setState({ normalPause });
  };

  changeSettings = () => {
    if (this.state.settings) {
      let rules = [];

      if (this.state.rules.length === 0) {
        for (let i = 0; i < this.weekdays.length; i++) {
          rules.push(this.getRule(i));
        }
      } else {
        rules = [...this.state.rules];
      }

      this.setState({ rules, settings: false });
    } else {
      this.setState({ settings: true });
    }
  };

  changeThisMonth = () => {
    this.setState(prevState => ({ thisMonth: !prevState.thisMonth }));
  };

  changeMasseuse = event => {
    this.setState({
      masseuse: this.props.masseuses[this.props.masseuseNames.indexOf(event.target.value)]
    });
  };

  changeMassageDuration = massageDuration => {
    if (typeof massageDuration !== "string") {
      this.setState({ massageDuration });
    }
  };

  changeTabIndex = index => {
    this.setState({ index });
  };

  changeDisabled = () => {
    this.setState(prevState => {
      const rules = [...prevState.rules];
      rules[prevState.index].disabled = !rules[prevState.index].disabled;
      return rules;
    });
  };

  changeDay = event => {
    const { value } = event.target;
    this.setState(prevState => {
      const rules = [...prevState.rules];
      rules[prevState.index].day = value;
      return rules;
    });
  };

  changeBigPauseStart = (id, start) => {
    if (typeof start === "string") {
      return;
    }
    this.setState(prevState => {
      const rules = [...prevState.rules];
      rules[prevState.index].bigPauses[id].start = start;
      return rules;
    });
  };

  changeBigPauseEnd = (id, end) => {
    if (typeof end === "string") {
      return;
    }
    this.setState(prevState => {
      const rules = [...prevState.rules];
      rules[prevState.index].bigPauses[id].end = end;
      return rules;
    });
  };

  addBigPause = () => {
    this.setState(prevState => {
      const rules = [...prevState.rules];
      rules[prevState.index].bigPauses.push(this.getBigPause());
      return rules;
    });
  };

  removeBigPause = id => {
    this.setState(prevState => {
      const rules = [...prevState.rules];
      rules[prevState.index].bigPauses.splice(id, 1);
      return rules;
    });
  };

  /**
   * Returns the source rule index for massage creation based on role copy settings.
   */
  getSourceIndex = (index, prevIndexes = []) => {
    if (this.state.rules[index].disabled || prevIndexes.indexOf(index) !== -1) {
      return -1;
    }
    if (this.state.rules[index].day === "–") {
      return index;
    }
    prevIndexes.push(index);
    return this.getSourceIndex(this.weekdays.indexOf(this.state.rules[index].day), prevIndexes);
  };

  /**
   * Checks whether a given time window is inside an array of pauses.
   */
  isInPauseWindow = (startTime, endTime, pauses) => {
    for (let i = 0; i < pauses.length; i++) {
      const pauseStart = this.cloneOverwritingDaytime(startTime, pauses[i].start);
      const pauseEnd = this.cloneOverwritingDaytime(startTime, pauses[i].end);
      if (startTime.isBetween(pauseStart, pauseEnd) || endTime.isBetween(pauseStart, pauseEnd)) {
        return true;
      }
    }
    return false;
  };

  /**
   * Clones a given moment date and copies its daytime values from another moment.
   */
  cloneOverwritingDaytime = (date, by) =>
    date.clone().set({
      hour: by.hours(),
      minute: by.minutes(),
      second: by.second(),
      millisecond: by.millisecond()
    });

  /**
   * Checks whether a date at a given day offset belongs to creation month limit.
   */
  isDayOfMonth = offset => {
    let comparissonDate;
    let offsetDate;
    if (this.state.thisMonth) {
      comparissonDate = moment().endOf("month");
      offsetDate = moment().add(offset, "days");
    } else {
      comparissonDate = moment()
        .add(1, "months")
        .endOf("month");
      offsetDate = moment()
        .endOf("month")
        .add(offset + 1, "days");
    }
    return !offsetDate.isAfter(comparissonDate);
  };

  /**
   * Creates all Massages generated using the rules.
   */
  addMassages = () => {
    const postArray = [];
    const massageHours = this.state.massageDuration.hours();
    const massageMins = this.state.massageDuration.minutes();
    const pauseHours = this.state.normalPause.hours();
    const pauseMins = this.state.normalPause.minutes();

    for (let i = 0; i < this.state.rules.length; i++) {
      const date = this.state.thisMonth ? moment() : moment().endOf("month");

      for (let j = 0; this.isDayOfMonth(j); j++) {
        if (
          date.add(1, "days").isoWeekday() !== 6 &&
          date.isoWeekday() !== 7 &&
          this.state.rules[i].for === date.format("dddd")
        ) {
          const sourceIndex = this.getSourceIndex(i);
          if (sourceIndex !== -1) {
            const currentStartTime = this.cloneOverwritingDaytime(date, this.state.rules[sourceIndex].startTime);
            const endTime = this.cloneOverwritingDaytime(date, this.state.rules[sourceIndex].endTime);
            let startTime = currentStartTime.clone();

            while (
              !currentStartTime
                .add(massageHours, "hours")
                .add(massageMins, "minutes")
                .isAfter(endTime)
            ) {
              if (!this.isInPauseWindow(startTime, currentStartTime, this.state.rules[sourceIndex].bigPauses)) {
                postArray.push({
                  date: startTime.toDate(),
                  ending: currentStartTime.toDate(),
                  masseuse: this.state.masseuse,
                  client: null,
                  facility: { id: this.props.facilityId }
                });
                currentStartTime.add(pauseHours, "hours").add(pauseMins, "minutes");
              }
              startTime = currentStartTime.clone();
            }
          }
        }
      }
    }

    if (postArray.length > 0) {
      Fetch.post(Util.MASSAGES_URL, postArray, this.props.getCallback);
    }
    this.props.onToggle(true);
  };

  /**
   * Checks all rule values in the imported file. Any incorrectly supplied values
   * are replaced by default values.
   */
  handleImportedFile = importData => {
    if (!Array.isArray(importData.rules) || importData.rules.length !== this.weekdays.length) {
      Util.notify("error", "", _t.translate("Invalid import file."));
      return null;
    }

    for (let i = 0; i < this.weekdays.length; i++) {
      if (Util.isEmpty(importData.rules[i].day)) {
        importData.rules[i].day = "–";
      }

      if (Util.isEmpty(importData.rules[i].for)) {
        importData.rules[i].for = this.weekdays[i];
      }

      if (Util.isEmpty(importData.rules[i].disabled)) {
        importData.rules[i].disabled = false;
      }

      if (Util.isEmpty(importData.rules[i].startTime)) {
        importData.rules[i].startTime = moment("08:00", "HH:mm");
      } else {
        importData.rules[i].startTime = moment(importData.rules[i].startTime);
      }

      if (Util.isEmpty(importData.rules[i].endTime)) {
        importData.rules[i].endTime = moment("18:00", "HH:mm");
      } else {
        importData.rules[i].endTime = moment(importData.rules[i].endTime);
      }

      if (!Array.isArray(importData.rules[i].bigPauses)) {
        importData.rules[i].bigPauses = [];
      }

      for (let j = 0; j < importData.rules[i].bigPauses.length; j++) {
        if (Util.isEmpty(importData.rules[i].bigPauses[j].start)) {
          importData.rules[i].bigPauses[j].start = moment("12:00", "HH:mm");
          importData.rules[i].bigPauses[j].end = moment("13:00", "HH:mm");
        } else {
          importData.rules[i].bigPauses[j].start = moment(importData.rules[i].bigPauses[j].start);
        }

        if (Util.isEmpty(importData.rules[i].bigPauses[j].end)) {
          importData.rules[i].bigPauses[j].start = moment("12:00", "HH:mm");
          importData.rules[i].bigPauses[j].end = moment("13:00", "HH:mm");
        } else {
          importData.rules[i].bigPauses[j].end = moment(importData.rules[i].bigPauses[j].end);
        }
      }
    }

    if (Util.isEmpty(importData.thisMonth)) {
      importData.thisMonth = false;
    }

    if (Util.isEmpty(importData.masseuse)) {
      importData.masseuse = this.getMasseuse();
    }

    if (Util.isEmpty(importData.massageDuration)) {
      importData.massageDuration = moment("00:30", "HH:mm");
    } else {
      importData.massageDuration = moment(importData.massageDuration);
    }

    if (Util.isEmpty(importData.normalPause)) {
      importData.normalPause = moment("00:10", "HH:mm");
    } else {
      importData.normalPause = moment(importData.normalPause);
    }

    return importData;
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
      const importData = this.handleImportedFile(JSON.parse(content));
      if (importData !== null) {
        this.setState({
          rules: importData.rules,
          thisMonth: importData.thisMonth,
          masseuse: Auth.isAdmin() ? importData.masseuse : this.getMasseuse(),
          massageDuration: importData.massageDuration,
          normalPause: importData.normalPause
        });
      }
    })(fileReader);
    fileReader.readAsText(event.target.files[0]);
  };

  /**
   * Exports value of rules into massage_rules.json file for future importing.
   * The file is automatically downloaded.
   */
  exportRules = () => {
    const exportJson = JSON.stringify({
      rules: this.state.rules,
      thisMonth: this.state.thisMonth,
      masseuse: this.state.masseuse,
      massageDuration: this.state.massageDuration,
      normalPause: this.state.normalPause
    });
    const blob = new Blob([exportJson], { type: "application/json" });

    const e = document.createEvent("MouseEvents");

    const a = document.createElement("a");
    a.download = "massages.json";
    a.href = window.URL.createObjectURL(blob);
    a.dataset.downloadurl = ["application/json", a.download, a.href].join(":");
    e.initMouseEvent("click", true, false, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
    a.dispatchEvent(e);
  };

  toggleDropdown = index => {
    if (this.state.activeDropdown !== index) {
      this.setState({ activeDropdown: index });
    } else {
      this.setState({ activeDropdown: -1 });
    }
  };

  handleModalKeyPress = event => {
    if (event.charCode === 13 && document.activeElement.tabIndex === -1) {
      this.addMassages();
    }
  };

  handleToggle = () => {
    if (!this.props.active) {
      this.setState({ masseuse: this.getMasseuse() });
    }

    this.props.onToggle(false);
  };

  createHeader = () => (
    <Row>
      <Col md="12">
        <h3>
          {_t.translate("Add schedule")}
          <div className="float-right">
            <Button id={this.tooltipTargets[0]} tag="label" outline htmlFor="fileImport">
              {_t.translate("Import")}
            </Button>
            <Input id="fileImport" className="d-none" type="file" onChange={this.importRules} accept=".json" />
            {!this.state.settings && (
              <TooltipButton
                className="ml-2 mb-2"
                onClick={this.exportRules}
                label={_t.translate("Export")}
                tooltip={_t.translate(
                  "Download a configuration file that you can use to import these rules at a later date"
                )}
              />
            )}
          </div>
        </h3>
        <hr />
      </Col>
    </Row>
  );

  createSettingInputs = () => (
    <ModalBody>
      {this.createHeader()}

      <Row>
        <Col md="12">
          <FormGroup check inline>
            <Label className="mr-2">{_t.translate("For:")}</Label>
            <div className="mt-2">
              {this.radios.map((item, index) => (
                <Label key={index} for={item}>
                  <Input
                    id={item}
                    type="radio"
                    onChange={this.changeThisMonth}
                    onKeyPress={this.changeSettings}
                    checked={this.state.thisMonth === !index}
                  />
                  <Label className="mr-2" for={item}>
                    {_t.translate(item)}
                  </Label>
                </Label>
              ))}
            </div>
          </FormGroup>
        </Col>
      </Row>

      <Row>
        {Auth.isAdmin() && (
          <Col md="6">
            <FormGroup>
              <Label for="masseuseNameSelect">{_t.translate("Masseur/Masseuse")}</Label>
              <Input
                id="masseuseNameSelect"
                type="select"
                value={`${this.state.masseuse.name} ${this.state.masseuse.surname}`}
                onChange={this.changeMasseuse}
              >
                {this.props.masseuseNames.map(item => (
                  <option key={item}>{item}</option>
                ))}
              </Input>
            </FormGroup>
          </Col>
        )}
        <LabeledDatetime
          size="3"
          label={_t.translate("Massage duration")}
          value={this.state.massageDuration}
          onChange={this.changeMassageDuration}
          onEnterPress={this.changeSettings}
          dateFormat={false}
        />
        <LabeledDatetime
          size="3"
          label={_t.translate("Break")}
          value={this.state.normalPause}
          onChange={this.changeNormalPause}
          onEnterPress={this.changeSettings}
          dateFormat={false}
          tooltip={_t.translate("Length of the standard break after a massage")}
        />
      </Row>

      <ModalActions
        primaryLabel={_t.translate("Next")}
        onProceed={this.changeSettings}
        onClose={() => this.props.onToggle(false)}
      />
    </ModalBody>
  );

  createMassageInputs = () => (
    <ModalBody>
      {this.createHeader()}

      <Row>
        <Col md="12">
          <Nav tabs className="mb-3">
            {this.weekdays.map((item, index) => (
              <Tab
                key={item}
                active={index === this.state.index}
                label={item}
                onClick={() => this.changeTabIndex(index)}
              />
            ))}
          </Nav>
        </Col>
      </Row>
      <Row>
        <Col md="12">
          <Label id={this.tooltipTargets[1]}>{_t.translate("Same as")}</Label>
        </Col>
      </Row>
      <Row>
        <Col md="10">
          <FormGroup>
            <Input
              type="select"
              value={this.state.rules[this.state.index].day}
              onChange={this.changeDay}
              onKeyPress={this.handleInputKeyPress}
              disabled={this.state.rules[this.state.index].disabled}
            >
              {this.weekdays.map(
                item => item !== this.weekdays[this.state.index] && <option key={item}>{item}</option>
              )}
              <option>–</option>
            </Input>
          </FormGroup>
        </Col>
        <Col md="2">
          <TooltipButton
            className="mr-3 float-right"
            label={_t.translate("Ignore")}
            onClick={this.changeDisabled}
            active={this.state.rules[this.state.index].disabled}
            tooltip={_t.translate("Ignore this day when creating the massages")}
          />
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
              disabled={this.state.rules[this.state.index].day !== "–" || this.state.rules[this.state.index].disabled}
            />
            <LabeledDatetime
              size="3"
              label={_t.translate("Shift end")}
              value={this.state.rules[this.state.index].endTime}
              onChange={this.changeEndTime}
              onEnterPress={this.addMassages}
              dateFormat={false}
              disabled={this.state.rules[this.state.index].day !== "–" || this.state.rules[this.state.index].disabled}
            />
          </Row>
        </Col>
      </Row>

      <Row>
        <Col md="12">
          <Label>{_t.translate("Breaks")}</Label>
          <TooltipIconButton
            className="ml-1"
            icon="plus"
            onClick={this.addBigPause}
            tooltip={_t.translate("Add")}
            disabled={
              this.state.rules[this.state.index].day !== "–" ||
              this.state.rules[this.state.index].bigPauses.length > 4 ||
              this.state.rules[this.state.index].disabled
            }
          />
        </Col>
      </Row>

      {this.state.rules[this.state.index].bigPauses.map((item, index) => (
        <Row key={item.start + index}>
          <Col md="12">
            <Row>
              <LabeledDatetime
                size="3"
                label={_t.translate("Break start")}
                value={item.start}
                onChange={start => this.changeBigPauseStart(index, start)}
                onEnterPress={this.addMassages}
                dateFormat={false}
                disabled={this.state.rules[this.state.index].day !== "–" || this.state.rules[this.state.index].disabled}
              />
              <LabeledDatetime
                size="3"
                label={_t.translate("Break end")}
                value={item.end}
                onChange={end => this.changeBigPauseEnd(index, end)}
                onEnterPress={this.addMassages}
                dateFormat={false}
                disabled={this.state.rules[this.state.index].day !== "–" || this.state.rules[this.state.index].disabled}
              />
              <TooltipIconButton
                className="ml-1"
                style={{ marginTop: "35px", border: "0px solid transparent" }}
                icon="times"
                onClick={() => this.removeBigPause(index)}
                tooltip={_t.translate("Remove")}
                disabled={this.state.rules[this.state.index].day !== "–" || this.state.rules[this.state.index].disabled}
              />
            </Row>
          </Col>
        </Row>
      ))}
      <TooltipGroup targets={this.tooltipTargets} labels={this.tooltipLabels} />

      <ModalActions primaryLabel={_t.translate("Create")} onProceed={this.addMassages} onClose={this.handleToggle}>
        <TooltipButton className="mr-2" onClick={this.changeSettings} label={_t.translate("Previous")} />
      </ModalActions>
    </ModalBody>
  );

  createModal = () => {
    if (this.props.withPortal) {
      return (
        <Modal size="lg" isOpen toggle={this.handleToggle} tabIndex="-1" onKeyPress={this.handleModalKeyPress}>
          {this.state.settings ? this.createSettingInputs() : this.createMassageInputs()}
        </Modal>
      );
    }
    if (this.state.settings) {
      return this.createSettingInputs();
    }
    return this.createMassageInputs();
  };

  render() {
    const { facilityId, getCallback, onToggle, active, masseuses, masseuseNames, withPortal, ...rest } = this.props;
    return (
      <span>
        <TooltipButton
          {...rest}
          onClick={this.handleToggle}
          label={_t.translate("Add schedule")}
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
  /** names of Massage masseuses in the portal */
  masseuseNames: PropTypes.arrayOf(PropTypes.string),
  /** Massage masseuses in the portal */
  masseuses: PropTypes.arrayOf(
    PropTypes.shape({
      email: PropTypes.string,
      masseur: PropTypes.bool,
      name: PropTypes.string,
      sub: PropTypes.string,
      subscribed: PropTypes.bool,
      surname: PropTypes.string
    })
  ),
  /** whether ModalContainer should be used; useful for testing to avoid portals */
  withPortal: PropTypes.bool
};

MassageBatchAddModal.defaultProps = {
  active: false,
  masseuseNames: [],
  masseuses: [],
  withPortal: true
};

export default MassageBatchAddModal;
