// react imports
import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';

// component imports
import BatchButton from '../buttons/BatchButton';
import ModalActions from '../buttons/ModalActions';
import Tab from '../navs/Tab';

// module imports
import Datetime from 'react-datetime';
import {ModalContainer, ModalDialog} from 'react-modal-dialog';
import moment from 'moment';

// util imports
import _t from '../../util/Translations';
import Util from '../../util/Util';

/**
 * Input Modal for creating multiple rules of Massages at once.
 */
class MassageBatchAddModal extends Component {

  state = {rules: [{
            days: [],
            weeks: "1",
            masseuse: "",
            startDate: moment(),
            startTime: moment("08:00", "HH:mm"),
            massageDuration: moment("00:30", "HH:mm"),
            massagesPerDay: "10",
            normalPause: moment("00:10", "HH:mm"),
            bigPause: moment("01:00", "HH:mm"),
            bigPauseAfter: "5",
          }], index: 0
        }

  weekdays = _t.translate('Monday_Tuesday_Wednesday_Thursday_Friday_Saturday_Sunday').split('_')

  yesterday = moment().subtract(1, "day")

  changeDays = (event, day) => {
    var rules = this.state.rules,
        days = this.state.rules[this.state.index].days;
    if (event.target.checked) {
      days.push(day);
    } else {
      days.splice(days.indexOf(day), 1);
    }
    rules[this.state.index].days = days;
    this.setState({rules: rules});
  }

  changeStartDate = (date) => {
    if (typeof date === 'string') {
      return;
    }
    var rules = this.state.rules;
    rules[this.state.index].startDate =
      date.isBefore(moment().startOf('minute').subtract(1, 'days')) ? moment() : date;
    this.setState({rules: rules});
  }

  changeStartTime = (time) => {
    if (typeof time === 'string') {
      return;
    }
    var rules = this.state.rules;
    rules[this.state.index].startTime = time;
    this.setState({rules: rules});
  }

  changeNormalPause = (duration) => {
    if (typeof duration === 'string') {
      return;
    }
    var rules = this.state.rules;
    rules[this.state.index].normalPause = duration;
    this.setState({rules: rules});
  }

  changeBigPause = (duration) => {
    if (typeof duration === 'string') {
      return;
    }
    var rules = this.state.rules;
    rules[this.state.index].bigPause = duration;
    this.setState({rules: rules});
  }

  changeMassageDuration = (duration) => {
    if (typeof duration === 'string') {
      return;
    }
    var rules = this.state.rules;
    rules[this.state.index].massageDuration = duration;
    this.setState({rules: rules});
  }

  changeMassagesPerDay = (event) => {
    if (Util.isEmpty(event.target.value) || parseInt(event.target.value, 10) < 1
        || parseInt(event.target.value, 10) > 100) {
      return;
    }
    var rules = this.state.rules;
    if (parseInt(rules[this.state.index].bigPauseAfter, 10) > parseInt(event.target.value, 10)) {
      rules[this.state.index].bigPauseAfter = event.target.value;
    }
    rules[this.state.index].massagesPerDay = event.target.value;
    this.setState({rules: rules});
  }

  changeBigPauseAfter = (event) => {
    if (Util.isEmpty(event.target.value) || parseInt(event.target.value, 10) < 1
        || parseInt(event.target.value, 10) > 100) {
      return;
    }
    var rules = this.state.rules;
    rules[this.state.index].bigPauseAfter = event.target.value;
    this.setState({rules: rules});
  }

  changeWeeks = (event) => {
    if (Util.isEmpty(event.target.value) || parseInt(event.target.value, 10) < 1
        || parseInt(event.target.value, 10) > 54) {
      return;
    }
    var rules = this.state.rules;
    rules[this.state.index].weeks = event.target.value;
    this.setState({rules: rules});
  }

  changeMasseuse = (event) => {
    var rules = this.state.rules;
    rules[this.state.index].masseuse = event.target.value;
    this.setState({rules: rules});
  }

  changeTabIndex = (index) => {
    this.setState({index: index});
  }

  addRule = () => {
    var rules = this.state.rules;
    rules.push({days: [],
                weeks: "1",
                masseuse: "",
                startDate: moment(),
                startTime: moment("08:00", "HH:mm"),
                massageDuration: moment("00:30", "HH:mm"),
                massagesPerDay: "10",
                normalPause: moment("00:10", "HH:mm"),
                bigPause: moment("01:00", "HH:mm"),
                bigPauseAfter: "5",
              });
    this.setState({rules: rules, index: (rules.length - 1)});
  }

  removeRule = (index) => {
    var rules = this.state.rules;
    rules.splice(index, 1);
    this.setState({rules: rules,
      index: this.state.index > (rules.length - 1) ? (rules.length - 1) : this.state.index});
  }

  getMinutes(from) {
    return (60 * from.get('hour', 'hours') + from.get('minute', 'minutes'));
  }

  /**
   * Calculates the date/ending based on day offset.
   */
  getDate = (isEnding, index, day, count) => {
    var date = moment(this.state.rules[index].startDate).add(day, 'days').startOf('day'),
        startMinutes = this.getMinutes(this.state.rules[index].startTime),
        massageMinutes = this.getMinutes(this.state.rules[index].massageDuration),
        pauseMinutes = this.getMinutes(this.state.rules[index].normalPause),
        bigPauseMinutes = (count >= this.state.rules[index].bigPauseAfter) ?
      (this.getMinutes(this.state.rules[index].bigPause) - pauseMinutes) : 0;

    var minutes = startMinutes + bigPauseMinutes + (massageMinutes + pauseMinutes) * count;
    if (isEnding) {
      minutes += massageMinutes;
    }
    return moment(date).add(minutes, 'minutes');
  }

  /**
   * Creates all Massages generated using the rules.
   */
  addMassages = () => {
    var postArray = [],
        informed = false;
    for (var i = 0; i < this.state.rules.length; i++) {
      if (Util.isEmpty(this.state.rules[i].masseuse)) {
        Util.notify("error", _t.translate('Masseuse is required!'), _t.translate('Rule #') + (i + 1));
        return;
      }
      if (this.state.rules[i].days.length === 0) {
        Util.notify("error", _t.translate('At least one repeat day is required!'), _t.translate('Rule #') + (i + 1));
        return;
      }
    }

    for (i = 0; i < this.state.rules.length; i++) {
      for (var j = 0; j < (this.state.rules[i].weeks * 7); j++) {
        if (this.state.rules[i].days.indexOf(moment(this.state.rules[i].startDate).add(j, 'days').format('dddd')) === -1) {
          continue;
        }
        for (var k = 0; k < this.state.rules[i].massagesPerDay; k++) {
          if (this.getDate(false, i, j, k).isBefore(moment())) {
            if (!informed) {
              Util.notify("warning",
                _t.translate('Not all massages were edited as in some cases the new date would have been before now.'),
                _t.translate('Warning'));
              informed = true;
            }
            continue;
          }
          postArray.push({
            date: this.getDate(false, i, j, k).toDate(),
            ending: this.getDate(true, i, j, k).toDate(),
            masseuse: this.state.rules[i].masseuse,
            client: null,
            facility: {id: this.props.facilityId}
          });
        }
      }
    }
    console.log(postArray);
    if (postArray.length > 0) {
      Util.post(Util.MASSAGES_URL, postArray, () => {
        this.props.getCallback();
        this.props.onToggle(true);
      });
    }
  }

  /**
   * Checks all rule values in the imported file. Any incorrectly supplied values
   * are replaced by default rule values.
   */
  handleImportedFile = (rules) => {
    if (!Array.isArray(rules) || rules.length === 0) {
        Util.notify("error", "", _t.translate("Invalid import file."));
        return null;
    }

    for (var i = 0; i < rules.length; i++) {
        if (!Array.isArray(rules[i].days)) {
          rules[i].days = [];
        }
        if (Util.isEmpty(rules[i].weeks) || parseInt(rules[i].weeks, 10) < 1
            || parseInt(rules[i].weeks, 10) > 54) {
          rules[i].weeks = "1";
        }
        if (Util.isEmpty(rules[i].masseuse)) {
          rules[i].masseuse = "";
        }
        if (Util.isEmpty(rules[i].startDate)
            || moment(rules[i].startDate).isBefore(moment().startOf('minute').subtract(1, 'days'))) {
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
        if (Util.isEmpty(rules[i].massagesPerDay) || parseInt(rules[i].massagesPerDay, 10) < 1
            || parseInt(rules[i].massagesPerDay, 10) > 100) {
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
        if (Util.isEmpty(rules[i].bigPauseAfter) || parseInt(rules[i].bigPauseAfter, 10) < 1
            || parseInt(rules[i].bigPauseAfter, 10) > 100) {
          rules[i].bigPauseAfter = "5";
          if (parseInt(rules[i].bigPauseAfter, 10) < parseInt(rules[i].massagesPerDay, 10)) {
            rules[i].bigPauseAfter = rules[i].massagesPerDay;
          }
        }
    }
    return rules;
  }

  /**
   * Create a FileReader to read a given file to import rules.
   */
  importRules = (event) => {
    if (typeof window.FileReader !== 'function') {
        Util.notify("error", "", _t.translate("FileReader API isn't supported by your browser."));
        return;
    }

    var fileReader = new FileReader();
    fileReader.onload = ((fileReader) => {
      return () => {
        var content = fileReader.result;
        var rules = this.handleImportedFile(JSON.parse(content));
        if (rules !== null) {
          this.setState({rules: rules});
        }
      }
    })(fileReader);
    fileReader.readAsText(event.target.files[0]);
  }

  /**
   * Exports value of rules into massage_rules.json file for future importing.
   * The file is automatically downloaded.
   */
  exportRules = () => {
    var rulesJson = JSON.stringify(this.state.rules);
    var blob = new Blob([rulesJson], {type: "application/json"}),
        e = document.createEvent('MouseEvents'),
        a = document.createElement('a');
    a.download = "massage_rules.json";
    a.href = window.URL.createObjectURL(blob);
    a.dataset.downloadurl =  ["application/json", a.download, a.href].join(':');
    e.initMouseEvent('click', true, false, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
    a.dispatchEvent(e);
  }

  handleModalKeyPress = (event) => {
    if (event.charCode === 13 && document.activeElement === ReactDOM.findDOMNode(this.modalDialog)) {
      this.addMassages();
    }
  }

  handleInputKeyPress = (event) => {
    if (event.key === 'Enter') {
      this.addMassages();
    }
  }

  renderInsides = () => {
    return (
      <div>
        <h2>
          { _t.translate('Create Massages') }
          <div className="pull-right">
            <label className="btn btn-default" style={{ 'marginRight': '5px' }}>
              { _t.translate('Import rules') }
              <input type="file" onChange={this.importRules} style={{'display': 'none' }}
                accept=".json" />
            </label>
            <BatchButton onClick={this.exportRules} label={ _t.translate('Export rules') } />
          </div>
        </h2>
        {this.state.rules.length > 0 ?
          <div>
            <ul className="nav nav-tabs" style={{ 'marginBottom': '15px' }}>
              {this.state.rules.map((item, index) => (
                <Tab active={index === this.state.index} label={ _t.translate('Rule #') + (index + 1)} key={index}
                  onClick={() => this.changeTabIndex(index)} />
              ))}
            </ul>
            <div className="form-group col-md-12">
              <div className="pull-right" style={{ 'marginLeft': '5px' }}>
                <span style={{ 'marginRight': '5px' }}>
                  <BatchButton onClick={this.addRule}
                    disabled={this.state.rules.length > 4 ? true : false}
                    label={ _t.translate('Create rule') }
                  />
                </span>
                <BatchButton onClick={() => this.removeRule(this.state.index)}
                  disabled={this.state.rules.length > 1 ? false : true}
                  label={ _t.translate('Remove rule') }
                />
              </div>

              <label>{ _t.translate('Repeat each') }</label>
              <div>
                {this.weekdays.map((item) => (
                  <label key={item} className="checkbox-inline">
                    <input type="checkbox" onChange={(event) => this.changeDays(event, item)}
                      onKeyPress={this.handleInputKeyPress}
                      checked={this.state.rules[this.state.index].days.indexOf(item) > -1}
                    />
                    <strong>{item.toLowerCase()}</strong>
                  </label>
                ))}
              </div>
            </div>

            <div className="form-group col-md-12">
              <div className="row">
                <div className="col-md-4">
                  <label htmlFor="startDateInput">{ _t.translate('Rule applies after') }</label>
                  <Datetime value={this.state.rules[this.state.index].startDate} onChange={this.changeStartDate}
                    timeFormat={false} isValidDate={(current) => { return current.isAfter(this.yesterday) }}
                    inputProps={{
                      id: "startDateInput",
                      placeholder: _t.translate('Date'),
                      onKeyPress: this.handleInputKeyPress
                    }}
                  />
                </div>

                <div className="col-md-4">
                  <label htmlFor="weeksInput">{ _t.translate('Number of repetitions (weekly)') }</label>
                  <input id="weeksInput" value={this.state.rules[this.state.index].weeks} onChange={this.changeWeeks}
                    className="form-control" onKeyPress={this.handleInputKeyPress} onFocus={Util.moveCursorToEnd}
                    autoFocus type="number" min="1" max="54" placeholder={ _t.translate('Number of repetitions') }
                  />
                </div>
              </div>
            </div>

            <div className="form-group col-md-12">
              <label htmlFor="masseuseInput">{ _t.translate('Masseur/Masseuse') }</label>
              <input id="masseuseInput" value={this.state.rules[this.state.index].masseuse}
                className="form-control" onChange={this.changeMasseuse} type="text" maxLength="64"
                onFocus={Util.moveCursorToEnd} onKeyPress={this.handleInputKeyPress}
                placeholder={ _t.translate('Masseur/Masseuse') } list="masseuses"
              />
              <datalist id="masseuses">
                {this.props.masseuses.map((item) => (
                  <option key={item} value={item} />
                ))}
              </datalist>
            </div>

            <div className="form-group col-md-12">
              <label htmlFor="startTimeInput">{ _t.translate('Massages') }</label>
              <div className="row">
                <div className="col-md-3">
                  <label htmlFor="startTimeInput">{ _t.translate('Shift start') }</label>
                  <Datetime value={this.state.rules[this.state.index].startTime} onChange={this.changeStartTime}
                    dateFormat={false}
                    inputProps={{
                      id: "startTimeInput",
                      placeholder: _t.translate('Shift start'),
                      onKeyPress: this.handleInputKeyPress
                    }}
                  />
                </div>

                <div className="col-md-3">
                  <label htmlFor="massageDurationInput">{ _t.translate('Duration') }</label>
                  <Datetime value={this.state.rules[this.state.index].massageDuration} onChange={this.changeMassageDuration}
                    dateFormat={false}
                    inputProps={{
                      id: "massageDurationInput",
                      placeholder: _t.translate('Duration'),
                      onKeyPress: this.handleInputKeyPress
                    }}
                  />
                </div>

                <div className="col-md-3">
                  <label htmlFor="massagesPerDayInput">{ _t.translate('Number of massages per day') }</label>
                  <input id="massagesPerDayInput" value={this.state.rules[this.state.index].massagesPerDay}
                    onChange={this.changeMassagesPerDay} className="form-control"
                    onKeyPress={this.handleInputKeyPress} onFocus={Util.moveCursorToEnd} type="number"
                    min="1" max="100" placeholder={ _t.translate('Number of massages per day') }
                  />
                </div>
              </div>
            </div>

            <div className="form-group col-md-12">
              <label htmlFor="normalPauseInput">{ _t.translate('Breaks') }</label>
              <div className="row">
                <div className="col-md-3">
                  <label htmlFor="normalPauseInput">{ _t.translate('Normal break') }</label>
                  <Datetime value={this.state.rules[this.state.index].normalPause} onChange={this.changeNormalPause}
                    dateFormat={false}
                    inputProps={{
                      id: "normalPauseInput",
                      placeholder: _t.translate('Normal break'),
                      onKeyPress: this.handleInputKeyPress
                    }}
                  />
                </div>

                <div className="col-md-3">
                  <label htmlFor="bigPauseInput">{ _t.translate('Lunch break') }</label>
                  <Datetime value={this.state.rules[this.state.index].bigPause} onChange={this.changeBigPause}
                    dateFormat={false}
                    inputProps={{
                      id: "bigPauseInput",
                      placeholder: _t.translate('Lunch break'),
                      onKeyPress: this.handleInputKeyPress
                    }}
                  />
                </div>

                <div className="col-md-3">
                  <label htmlFor="pauseAfterInput">{ _t.translate('Lunch after') }</label>
                  <input id="pauseAfterInput" value={this.state.rules[this.state.index].bigPauseAfter}
                    onChange={this.changeBigPauseAfter} onKeyPress={this.handleInputKeyPress}
                    className="form-control" onFocus={Util.moveCursorToEnd} type="number" min="1"
                    max={this.state.rules[this.state.index].massagesPerDay} placeholder={ _t.translate('Lunch after') }
                  />
                  <label htmlFor="pauseAfterInput">{ _t.translate('...massages') }</label>
                </div>
              </div>
            </div>
          </div> :
          <div className="col-md-2">
            <BatchButton onClick={this.addRule} disabled={false} label={ _t.translate('Create rule') } />
          </div>
        }
        <ModalActions
          primaryLabel={ _t.translate('Create') }
          onProceed={this.addMassages}
          onClose={() => this.props.onToggle(false)}
          autoFocus={false}
        />
      </div>
    )
  }

  render() {
    return (
      <span style={{ 'marginRight': '5px', 'marginLeft': '5px' }}>
        <BatchButton onClick={() => this.props.onToggle(false)} label={ _t.translate('Add more') } />

        {this.props.active ?
          this.props.withPortal ?
            <ModalContainer onClose={() => this.props.onToggle(false)}>
              <ModalDialog onClose={() => this.props.onToggle(false)} width="50%" style={{ 'outline': 'none' }}
                tabIndex="1" onKeyPress={this.handleModalKeyPress}
                ref={(dialog) => {
                  this.modalDialog = dialog;
              }}>
              {this.renderInsides()}
              </ModalDialog>
            </ModalContainer> :
            this.renderInsides() : ''
        }
      </span>
    )
  }
}

MassageBatchAddModal.propTypes = {
  /** whether the dialog should be shown */
  active: PropTypes.bool,
  /** ID of the selected Facility */
  facilityId: PropTypes.number.isRequired,
  /** unique Massage masseuses of the given Facility */
  masseuses: PropTypes.arrayOf(PropTypes.string),
  /** callback function for Massage list update */
  getCallback: PropTypes.func.isRequired,
  /** function called on modal toggle */
  onToggle: PropTypes.func.isRequired,
  /** whether ModalContainer should be used; useful for testing to avoid portals */
  withPortal: PropTypes.bool
};

MassageBatchAddModal.defaultProps = {
  withPortal: true
};

export default MassageBatchAddModal
