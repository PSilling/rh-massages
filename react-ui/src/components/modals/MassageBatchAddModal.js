// react imports
import React, { Component } from 'react';
import ReactDOM from 'react-dom';

// component imports
import BatchButton from '../buttons/BatchButton';
import ModalActions from '../buttons/ModalActions';

// module imports
import {ModalContainer, ModalDialog} from 'react-modal-dialog';
import Tabs from 'react-simpletabs';
import 'react-simpletabs/lib/react-simpletabs.css';
import '../../styles/modules/react-simpletabs.css';
import moment from 'moment';

// util imports
import _t from '../../util/Translations';
import Util from '../../util/Util';

class MassagaBatchAddModal extends Component {

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
            }], index: 1}

  changeDays = (event, day) => {
    var rules = this.state.rules;
    var days = this.state.rules[this.state.index-1].days;
    if (event.target.checked) {
      days.push(day);
    } else {
      days.splice(days.indexOf(day), 1);
    }
    rules[this.state.index-1].days = days;
    this.setState({rules: rules});
  }

  changeStartDate = (event) => {
    if (Util.isEmpty(event.target.value) || moment(event.target.value).isBefore(moment().startOf('minute').subtract(1, 'days'))) {
      return;
    }
    var rules = this.state.rules;
    rules[this.state.index-1].startDate = event.target.value;
    this.setState({rules: rules});
  }

  changeStartTime = (event) => {
    if (Util.isEmpty(event.target.value)) {
      return;
    }
    var rules = this.state.rules;
    rules[this.state.index-1].startTime = event.target.value;
    this.setState({rules: rules});
  }

  changeNormalPause = (event) => {
    if (Util.isEmpty(event.target.value)) {
      return;
    }
    var rules = this.state.rules;
    rules[this.state.index-1].normalPause = event.target.value;
    this.setState({rules: rules});
  }

  changeBigPause = (event) => {
    if (Util.isEmpty(event.target.value)) {
      return;
    }
    var rules = this.state.rules;
    rules[this.state.index-1].bigPause = event.target.value;
    this.setState({rules: rules});
  }

  changeMassageDuration = (event) => {
    if (Util.isEmpty(event.target.value)) {
      return;
    }
    var rules = this.state.rules;
    rules[this.state.index-1].massageDuration = event.target.value;
    this.setState({rules: rules});
  }

  changeMassagesPerDay = (event) => {
    if (Util.isEmpty(event.target.value) || parseInt(event.target.value, 10) < 1
        || parseInt(event.target.value, 10) > 100) {
      return;
    }
    var rules = this.state.rules;
    if (parseInt(rules[this.state.index-1].bigPauseAfter, 10) > parseInt(event.target.value, 10)) {
      rules[this.state.index-1].bigPauseAfter = event.target.value;
    }
    rules[this.state.index-1].massagesPerDay = event.target.value;
    this.setState({rules: rules});
  }

  changeBigPauseAfter = (event) => {
    if (Util.isEmpty(event.target.value) || parseInt(event.target.value, 10) < 1
        || parseInt(event.target.value, 10) > 100) {
      return;
    }
    var rules = this.state.rules;
    rules[this.state.index-1].bigPauseAfter = event.target.value;
    this.setState({rules: rules});
  }

  changeWeeks = (event) => {
    if (Util.isEmpty(event.target.value) || parseInt(event.target.value, 10) < 1
        || parseInt(event.target.value, 10) > 54) {
      return;
    }
    var rules = this.state.rules;
    rules[this.state.index-1].weeks = event.target.value;
    this.setState({rules: rules});
  }

  changeMasseuse = (event) => {
    var rules = this.state.rules;
    rules[this.state.index-1].masseuse = event.target.value;
    this.setState({rules: rules});
  }

  onTabChange = (index) => {
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
    this.setState({rules: rules, index: rules.length});
  }

  removeRule = (index) => {
    var rules = this.state.rules;
    rules.splice(index, 1);
    this.setState({rules: rules,
      index: this.state.index > rules.length ? rules.length : this.state.index});
  }

  getMinutes(time) {
    return (parseInt(time.substring(0, 2) * 60, 10) + parseInt(time.substring(3, 5), 10));
  }

  getDate = (isEnding, index, day, count) => {
    var date = moment(this.state.rules[index].startDate).add(day, 'days').startOf('day');
    var startMinutes = this.getMinutes(this.state.rules[index].startTime);
    var massageMinutes = this.getMinutes(this.state.rules[index].massageDuration);
    var pauseMinutes = this.getMinutes(this.state.rules[index].normalPause);
    var bigPauseMinutes = (count >= this.state.rules[index].bigPauseAfter) ?
      (this.getMinutes(this.state.rules[index].bigPause) - pauseMinutes) : 0;

    var minutes = startMinutes + bigPauseMinutes + (massageMinutes + pauseMinutes) * count;
    if (isEnding) {
      minutes += massageMinutes;
    }

    return moment(date).add(minutes, 'minutes').toDate();
  }

  hasMoreDays = (i, j) => {
    if (this.state.rules.length === (i + 1)) {
      if ((parseInt(this.state.rules[i].weeks, 10) * 7) === (j + 1)) {
        return false;
      } else {
        for (var k = (j + 1); k < (this.state.rules[i].weeks * 7); k++) {
          if (this.state.rules[i].days.indexOf(moment(this.state.rules[i].startDate).add(k, 'days').format('dddd')) > -1) {
            return true;
          }
        }
        return false;
      }
    } else {
      return true;
    }
  }

  /**
   * Handles the post request.
   */
  addMassages = () => {
    var informed = false;
    for (var i = 0; i < this.state.rules.length; i++) {
      if (Util.isEmpty(this.state.rules[i].masseuse)) {
        Util.notify("error", _t.translate('Masseuse is required!'), _t.translate('Rule #') + (i + 1));
        return;
      }
    }

    var callback = () => {
      this.props.getCallback();
      this.props.onToggle(true);
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
          Util.post(Util.MASSAGES_URL, {
            date: this.getDate(false, i, j, k),
            ending: this.getDate(true, i, j, k),
            masseuse: this.state.rules[i].masseuse,
            client: null,
            contact: null,
            facility: {id: this.props.facilityId}
          }, callback, (!this.hasMoreDays(i, j)
            && parseInt(this.state.rules[i].massagesPerDay, 10) === (k + 1)) ? true : false);
        }
      }
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
    var blob = new Blob([rulesJson], {type: "application/json"});
    var e    = document.createEvent('MouseEvents');
    var a    = document.createElement('a');
    a.download = "massage_rules.json";
    a.href = window.URL.createObjectURL(blob);
    a.dataset.downloadurl =  ["application/json", a.download, a.href].join(':');
    e.initMouseEvent('click', true, false, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
    a.dispatchEvent(e);
  }

  addMasseuseOptions = () => {
    var options = [];

    for (var i = 0; i < this.props.masseuses.length; i++) {
        options.push(<option key={i} value={this.props.masseuses[i]} />);
    }

    return options;
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

  moveCursorToEnd = (event) => {
    var value = event.target.value;
    event.target.value = '';
    event.target.value = value;
  }

  render() {
    return(
      <span style={{ 'marginRight': '5px' }}>
        <BatchButton onSubmit={() => this.props.onToggle(false)} label={ _t.translate('Batch addition') } />

        {this.props.active ?
          <ModalContainer onClose={() => this.props.onToggle(false)}>
            <ModalDialog onClose={() => this.props.onToggle(false)} width="50%" style={{ 'outline': 'none' }}
              tabIndex="1" onKeyPress={this.handleModalKeyPress}
              ref={(dialog) => {
                this.modalDialog = dialog;
            }}>
              <h2>
                { _t.translate('Create Massages') }
              </h2>
              <div className="pull-right">
                <label className="btn btn-default" style={{ 'marginRight': '5px' }}>
                  { _t.translate('Import rules') }
                  <input type="file" onChange={this.importRules} style={{'display': 'none' }}
                    accept=".json" />
                </label>
                <BatchButton onSubmit={() => this.exportRules()} disabled={false}
                  label={ _t.translate('Export rules') } />
              </div>
              {this.state.rules.length > 0 ?
                <Tabs tabActive={this.state.index} onAfterChange={this.onTabChange}>
                  {this.state.rules.map((item, index) => (
                    <Tabs.Panel title={ _t.translate('Rule #') + (index + 1)} key={item}>
                      <form>
                        <div className="form-group col-md-12">
                          <div className="pull-right">
                            <span style={{ 'marginRight': '5px' }}>
                              <BatchButton onSubmit={() => this.addRule()}
                                disabled={this.state.rules.length > 4 ? true : false}
                                label={ _t.translate('Create rule') }
                              />
                            </span>
                            <BatchButton onSubmit={() => this.removeRule(index)}
                              disabled={this.state.rules.length > 1 ? false : true}
                              label={ _t.translate('Remove rule') }
                            />
                          </div>
                          <label>{ _t.translate('Repeat each') }</label>
                          <div>
                            <label className="checkbox-inline">
                              <input type="checkbox" onChange={(event) => this.changeDays(event, "Monday")}
                                onKeyPress={this.handleInputKeyPress} style={{ 'marginRight': '5px' }}
                                checked={this.state.rules[this.state.index-1].days.indexOf("Monday") > -1 ? true : false}
                              />
                              <strong>{ _t.translate('monday') }</strong>
                            </label>
                            <label className="checkbox-inline">
                              <input type="checkbox" onChange={(event) => this.changeDays(event, "Tuesday")}
                                onKeyPress={this.handleInputKeyPress} style={{ 'marginRight': '5px' }}
                                checked={this.state.rules[this.state.index-1].days.indexOf("Tuesday") > -1 ? true : false}
                              />
                              <strong>{ _t.translate('tuesday') }</strong>
                            </label>
                            <label className="checkbox-inline">
                              <input type="checkbox" onChange={(event) => this.changeDays(event, "Wednesday")}
                                onKeyPress={this.handleInputKeyPress} style={{ 'marginRight': '5px' }}
                                checked={this.state.rules[this.state.index-1].days.indexOf("Wednesday") > -1 ? true : false}
                              />
                              <strong>{ _t.translate('wednesday') }</strong>
                            </label>
                            <label className="checkbox-inline">
                              <input type="checkbox" onChange={(event) => this.changeDays(event, "Thursday")}
                                onKeyPress={this.handleInputKeyPress} style={{ 'marginRight': '5px' }}
                                checked={this.state.rules[this.state.index-1].days.indexOf("Thursday") > -1 ? true : false}
                              />
                              <strong>{ _t.translate('thursday') }</strong>
                            </label>
                            <label className="checkbox-inline">
                              <input type="checkbox" onChange={(event) => this.changeDays(event, "Friday")}
                                onKeyPress={this.handleInputKeyPress} style={{ 'marginRight': '5px' }}
                                checked={this.state.rules[this.state.index-1].days.indexOf("Friday") > -1 ? true : false}
                              />
                              <strong>{ _t.translate('friday') }</strong>
                            </label>
                            <label className="checkbox-inline">
                              <input type="checkbox" onChange={(event) => this.changeDays(event, "Saturday")}
                                onKeyPress={this.handleInputKeyPress} style={{ 'marginRight': '5px' }}
                                checked={this.state.rules[this.state.index-1].days.indexOf("Saturday") > -1 ? true : false}
                              />
                              <strong>{ _t.translate('saturday') }</strong>
                            </label>
                            <label className="checkbox-inline">
                              <input type="checkbox" onChange={(event) => this.changeDays(event, "Sunday")}
                                onKeyPress={this.handleInputKeyPress} style={{ 'marginRight': '5px' }}
                                checked={this.state.rules[this.state.index-1].days.indexOf("Sunday") > -1 ? true : false}
                              />
                              <strong>{ _t.translate('sunday') }</strong>
                            </label>
                          </div>
                        </div>
                        <div className="form-group col-md-12">
                          <div className="row">
                            <div className="col-md-4">
                              <label>{ _t.translate('Rule applies after') }</label>
                              <input value={this.state.rules[this.state.index-1].startDate} onChange={this.changeStartDate}
                                className="form-control" onKeyPress={this.handleInputKeyPress}
                                type="date" min={moment().format("YYYY-MM-DD")}
                                placeholder={ _t.translate('Date') }
                              />
                            </div>
                            <div className="col-md-4">
                            <label>{ _t.translate('Number of repetitions (weekly)') }</label>
                            <input value={this.state.rules[this.state.index-1].weeks} onChange={this.changeWeeks}
                              className="form-control" onKeyPress={this.handleInputKeyPress} onFocus={this.moveCursorToEnd}
                              type="number" min="1" max="54" placeholder={ _t.translate('Number of repetitions') }
                            />
                            </div>
                          </div>
                        </div>
                        <div className="form-group col-md-12">
                          <label>{ _t.translate('Masseur/Masseuse') }</label>
                          <input value={this.state.rules[this.state.index-1].masseuse} onChange={this.changeMasseuse}
                            className="form-control" onFocus={this.moveCursorToEnd}
                            onKeyPress={this.handleInputKeyPress} type="text" maxLength="64"
                            placeholder={ _t.translate('Masseur/Masseuse') } list="masseuses"
                          />
                          <datalist id="masseuses">
                            {this.addMasseuseOptions()}
                          </datalist>
                        </div>
                        <div className="form-group col-md-12">
                          <label>{ _t.translate('Massages') }</label>
                          <div className="row">
                            <div className="col-md-3">
                              <label>{ _t.translate('Shift start') }</label>
                              <input value={this.state.rules[this.state.index-1].startTime} onChange={this.changeStartTime}
                                className="form-control" onKeyPress={this.handleInputKeyPress}
                                type="time" placeholder={ _t.translate('Shift start') }
                              />
                            </div>
                            <div className="col-md-3">
                              <label>{ _t.translate('Duration') }</label>
                              <input value={this.state.rules[this.state.index-1].massageDuration} onChange={this.changeMassageDuration}
                                className="form-control" onKeyPress={this.handleInputKeyPress}
                                type="time" placeholder={ _t.translate('Duration') }
                              />
                            </div>
                            <div className="col-md-3">
                              <label>{ _t.translate('Number of massages per day') }</label>
                              <input value={this.state.rules[this.state.index-1].massagesPerDay} onChange={this.changeMassagesPerDay}
                                className="form-control" onKeyPress={this.handleInputKeyPress} onFocus={this.moveCursorToEnd}
                                type="number" min="1" max="100" placeholder={ _t.translate('Number of massages per day') }
                              />
                            </div>
                          </div>
                        </div>
                        <div className="form-group col-md-12">
                          <label>{ _t.translate('Breaks') }</label>
                          <div className="row">
                            <div className="col-md-3">
                              <label>{ _t.translate('Normal break') }</label>
                              <input value={this.state.rules[this.state.index-1].normalPause} onChange={this.changeNormalPause}
                                className="form-control" onKeyPress={this.handleInputKeyPress}
                                type="time" placeholder={ _t.translate('Normal break') }
                              />
                            </div>
                            <div className="col-md-3">
                              <label>{ _t.translate('Lunch break') }</label>
                              <input value={this.state.rules[this.state.index-1].bigPause} onChange={this.changeBigPause}
                                className="form-control" onKeyPress={this.handleInputKeyPress}
                                type="time" placeholder={ _t.translate('Lunch break') }
                              />
                            </div>
                            <div className="col-md-3">
                              <label>{ _t.translate('Lunch break after') }</label>
                              <input value={this.state.rules[this.state.index-1].bigPauseAfter} onChange={this.changeBigPauseAfter}
                                className="form-control" onKeyPress={this.handleInputKeyPress} onFocus={this.moveCursorToEnd}
                                type="number" min="1" max={this.state.rules[this.state.index-1].massagesPerDay} placeholder={ _t.translate('Lunch break after') }
                              />
                              <label>{ _t.translate('...massages') }</label>
                            </div>
                          </div>
                        </div>
                      </form>
                    </Tabs.Panel>
                  ))}
                </Tabs> :
                <div className="col-md-2">
                  <BatchButton onSubmit={() => this.addRule()} disabled={false}
                    label={ _t.translate('Create rule') } />
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

export default MassagaBatchAddModal
