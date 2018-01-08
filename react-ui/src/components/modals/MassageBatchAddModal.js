// react imports
import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';

// component imports
import BatchButton from '../buttons/BatchButton';
import ModalActions from '../buttons/ModalActions';
import Tab from '../navs/Tab';

// module imports
import {ModalContainer, ModalDialog} from 'react-modal-dialog';
import moment from 'moment';

// util imports
import _t from '../../util/Translations';
import Util from '../../util/Util';

/**
 * Custom modal for creating multiple Massages at once
 */
class MassageBatchAddModal extends Component {

  state = {rules: [{
              days: [],
              weeks: "1",
              masseuse: "",
              startDate: moment().format("YYYY-MM-DD"),
              startTime: "08:00",
              massageDuration: "00:30",
              massagesPerDay: "10",
              normalPause: "00:10",
              bigPause: "01:00",
              bigPauseAfter: "5",
            }], index: 0}

  weekdays = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

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

  changeStartDate = (event) => {
    if (Util.isEmpty(event.target.value)
      || moment(event.target.value).isBefore(moment().startOf('minute').subtract(1, 'days'))) {
      return;
    }
    var rules = this.state.rules;
    rules[this.state.index].startDate = event.target.value;
    this.setState({rules: rules});
  }

  changeStartTime = (event) => {
    if (Util.isEmpty(event.target.value)) {
      return;
    }
    var rules = this.state.rules;
    rules[this.state.index].startTime = event.target.value;
    this.setState({rules: rules});
  }

  changeNormalPause = (event) => {
    if (Util.isEmpty(event.target.value)) {
      return;
    }
    var rules = this.state.rules;
    rules[this.state.index].normalPause = event.target.value;
    this.setState({rules: rules});
  }

  changeBigPause = (event) => {
    if (Util.isEmpty(event.target.value)) {
      return;
    }
    var rules = this.state.rules;
    rules[this.state.index].bigPause = event.target.value;
    this.setState({rules: rules});
  }

  changeMassageDuration = (event) => {
    if (Util.isEmpty(event.target.value)) {
      return;
    }
    var rules = this.state.rules;
    rules[this.state.index].massageDuration = event.target.value;
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
                startDate: moment().format("YYYY-MM-DD"),
                startTime: "08:00",
                massageDuration: "00:30",
                massagesPerDay: "10",
                normalPause: "00:10",
                bigPause: "01:00",
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

  getMinutes(time) {
    return (parseInt(time.substring(0, 2) * 60, 10) + parseInt(time.substring(3, 5), 10));
  }

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
    return moment(date).add(minutes, 'minutes').toDate();
  }

  /**
   * Handles the post request.
   */
  addMassages = () => {
    var postArray = [],
        informed = false;
    for (var i = 0; i < this.state.rules.length; i++) {
      if (Util.isEmpty(this.state.rules[i].masseuse)) {
        Util.notify("error", _t.translate('Masseuse is required!'), _t.translate('Rule #') + (i + 1));
        return;
      }
    }

    for (i = 0; i < this.state.rules.length; i++) {
      for (var j = 0; j < (this.state.rules[i].weeks * 7); j++) {
        if (this.state.rules[i].days.indexOf(moment(this.state.rules[i].startDate).add(j, 'days').format('dddd')) === -1) {
          continue;
        }
        for (var k = 0; k < this.state.rules[i].massagesPerDay; k++) {
          if (moment(this.getDate(false, i, j, k)).isBefore(moment())) {
            if (!informed) {
              Util.notify("warning",
                _t.translate('Not all massages were edited as in some cases the new date would have been before now.'),
                _t.translate('Warning'));
              informed = true;
            }
            continue;
          }
          postArray.push({
            date: this.getDate(false, i, j, k),
            ending: this.getDate(true, i, j, k),
            masseuse: this.state.rules[i].masseuse,
            client: null,
            contact: null,
            facility: {id: this.props.facilityId}
          });
        }
      }
    }
    if (postArray.length > 0) {
      Util.post(Util.MASSAGES_URL, postArray, () => {
        this.props.getCallback();
        this.props.onToggle(true);
      });
    }
  }

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
          rules[i].startDate = moment().format("YYYY-MM-DD");
        }
        if (Util.isEmpty(rules[i].startTime)) {
          rules[i].startTime = "08:00";
        }
        if (Util.isEmpty(rules[i].massageDuration)) {
          rules[i].massageDuration = "00:30";
        }
        if (Util.isEmpty(rules[i].massagesPerDay) || parseInt(rules[i].massagesPerDay, 10) < 1
            || parseInt(rules[i].massagesPerDay, 10) > 100) {
          rules[i].massagesPerDay = "10";
        }
        if (Util.isEmpty(rules[i].normalPause)) {
          rules[i].normalPause = "00:10";
        }
        if (Util.isEmpty(rules[i].bigPause)) {
          rules[i].bigPause = "01:00";
        }
        if (Util.isEmpty(rules[i].bigPause)) {
          rules[i].bigPause = "01:00";
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

  render() {
    return (
      <span style={{ 'marginRight': '5px' }}>
        <BatchButton onClick={() => this.props.onToggle(false)} label={ _t.translate('Batch addition') } />

        {this.props.active ?
          <ModalContainer onClose={() => this.props.onToggle(false)}>
            <ModalDialog onClose={() => this.props.onToggle(false)} width="50%" style={{ 'outline': 'none' }}
              tabIndex="1" onKeyPress={this.handleModalKeyPress}
              ref={(dialog) => {
                this.modalDialog = dialog;
            }}>
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
                          <strong>{ _t.translate(item.toLowerCase()) }</strong>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div className="form-group col-md-12">
                    <div className="row">
                      <div className="col-md-4">
                        <label htmlFor="startDateInput">{ _t.translate('Rule applies after') }</label>
                        <input id="startDateInput" value={this.state.rules[this.state.index].startDate}
                          onChange={this.changeStartDate} className="form-control" onKeyPress={this.handleInputKeyPress}
                          type="date" min={moment().format("YYYY-MM-DD")} placeholder={ _t.translate('Date') }
                        />
                      </div>

                      <div className="col-md-4">
                      <label htmlFor="weeksInput">{ _t.translate('Number of repetitions (weekly)') }</label>
                      <input id="weeksInput" value={this.state.rules[this.state.index].weeks} onChange={this.changeWeeks}
                        className="form-control" onKeyPress={this.handleInputKeyPress} onFocus={Util.moveCursorToEnd}
                        type="number" min="1" max="54" placeholder={ _t.translate('Number of repetitions') }
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
                        <input id="startTimeInput" value={this.state.rules[this.state.index].startTime}
                          className="form-control" onKeyPress={this.handleInputKeyPress} type="time"
                          onChange={this.changeStartTime} placeholder={ _t.translate('Shift start') }
                        />
                      </div>

                      <div className="col-md-3">
                        <label htmlFor="massageDurationInput">{ _t.translate('Duration') }</label>
                        <input id="massageDurationInput" value={this.state.rules[this.state.index].massageDuration}
                          className="form-control" onKeyPress={this.handleInputKeyPress} type="time"
                          onChange={this.changeMassageDuration} placeholder={ _t.translate('Duration') }
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
                        <input id="normalPauseInput" value={this.state.rules[this.state.index].normalPause}
                          onChange={this.changeNormalPause} className="form-control" type="time"
                          onKeyPress={this.handleInputKeyPress} placeholder={ _t.translate('Normal break') }
                        />
                      </div>

                      <div className="col-md-3">
                        <label htmlFor="bigPauseInput">{ _t.translate('Lunch break') }</label>
                        <input id="bigPauseInput" value={this.state.rules[this.state.index].bigPause}
                          onChange={this.changeBigPause} onKeyPress={this.handleInputKeyPress} type="time"
                          className="form-control" placeholder={ _t.translate('Lunch break') }
                        />
                      </div>

                      <div className="col-md-3">
                        <label htmlFor="pauseAfterInput">{ _t.translate('Lunch break after') }</label>
                        <input id="pauseAfterInput" value={this.state.rules[this.state.index].bigPauseAfter}
                          onChange={this.changeBigPauseAfter} onKeyPress={this.handleInputKeyPress}
                          className="form-control" onFocus={Util.moveCursorToEnd} type="number" min="1"
                          max={this.state.rules[this.state.index].massagesPerDay} placeholder={ _t.translate('Lunch break after') }
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
            </ModalDialog>
          </ModalContainer> : ''
        }
      </span>
    )
  }
}

MassageBatchAddModal.propTypes = {
  active: PropTypes.bool, // whether the dialog should be shown
  facilityId: PropTypes.number.isRequired, // ID of the selected Facility
  masseuses: PropTypes.arrayOf(PropTypes.string), // unique Massage masseuses of the given Facility
  getCallback: PropTypes.func.isRequired, // callback function for Massage list update
  onToggle: PropTypes.func.isRequired // function called on modal toggle
};

export default MassageBatchAddModal
