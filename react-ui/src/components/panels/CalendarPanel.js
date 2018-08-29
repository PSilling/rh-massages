// react imports
import React, { Component } from 'react';
import PropTypes from 'prop-types';

// component imports
import CalendarToolbar from '../util/CalendarToolbar';
import MassageEventModal from '../modals/MassageEventModal';

// module imports
import moment from 'moment';
import BigCalendar from 'react-big-calendar';

// util imports
import Auth from '../../util/Auth';
import _t from '../../util/Translations';
import Util from '../../util/Util';

BigCalendar.momentLocalizer(moment);

/**
 * Calendar with massage events. Supports color feedback and Massage administration.
 */
class CalendarPanel extends Component {

  state = {active: false, action: "", selectedEvent: null, label: "", overtime: false,
            date: new Date(), view: this.props.allowEditation ? 'work_week' : 'month'}

  localization = {
    allDay: _t.translate('All day'),
    previous: "<",
    next: ">",
    today: _t.translate('Today'),
    month: _t.translate('Month'),
    date: _t.translate('Date'),
    time: _t.translate('Time'),
    event: _t.translate('Event'),
    work_week: _t.translate('Week'),
    showMore: (total) => "+ " + _t.translate("Show more") + ` (${total})`
  }

  eventStyler = (event) => {
    return {
      style: { backgroundColor: event.bgColor, color: "black", border: 0, borderRadius: "4px",
        marginLeft: this.state.view === 'month' ? "0px" : "5px",
        opacity: (Util.findInArrayById(this.props.selected, event.massage.id) !== -1) ? "0.8" : "1.0" }
    };
  }

  onSelectEvent = (event) => {
    if (this.props.selectEvents) {
      this.props.onSelect(event);
    } else if (this.props.allowEditation) {
      this.configureModalActions(event);
    } else {
      this.setState({active: true, action: "none", label: "none", selectedEvent: event});
    }
  }

  /**
   * Configures MassageEventModal buttons based on event client assignment status.
   */
  configureModalActions = (event) => {
    if (Util.isEmpty(event.massage.client)) {
      if ((this.props.massageMinutes + moment(event.massage.ending)
      .diff(moment(event.massage.date), 'minutes')) > Util.MAX_MASSAGE_MINS) {
        this.setState({active: true, action: "none", selectedEvent: event,
          label: _t.translate('Assign me'), overtime: true});
      } else {
        this.setState({active: true, action: "assign", selectedEvent: event,
          label: _t.translate('Assign me'), overtime: false});
      }
    } else if (Auth.getSub() === event.massage.client.sub) {
      this.setState({active: true, action: "cancel", selectedEvent: event,
        label: _t.translate('Unassign me'), overtime: false});
    } else if (Auth.isAdmin()) {
      this.setState({active: true, action: "cancel", selectedEvent: event,
        label: _t.translate('Force cancel'), overtime: false});
    } else {
      this.setState({active: true, action: "none", selectedEvent: event,
        label: "none", overtime: false});
    }
  }

  onNavigate = (date, view) => {
    this.props.onDateChange(moment(date), view);
    this.setState({date: date});
  }

  editEvent = () => {
    this.props.onEdit(this.state.selectedEvent.massage);
    this.setState({active: false});
  }

  deleteEvent = () => {
    this.props.onDelete(this.state.selectedEvent.massage.id);
    this.setState({active: false});
  }

  generateTitle = (event) => {
    if (this.props.allowEditation) {
      return event.massage.masseuse;
    } else {
      return (event.massage.facility.name + ': ' + event.massage.masseuse);
    }
  }

  handleToggle = () => {
    this.setState({active: !this.state.active});
  }

  changeView = (view) => {
    this.setState({view: view});
    this.props.onDateChange(moment(this.state.date), view);
  }

  changeDate = (left) => {
    var dateAsMoment = moment(this.state.date),
        modifier = this.state.view === 'month' ? "month" : "week";

    if (left) {
      dateAsMoment.subtract(1, modifier);
    } else {
      dateAsMoment.add(1, modifier);
    }

    this.setState({date: dateAsMoment.toDate()});
    this.props.onDateChange(dateAsMoment, this.state.view);
  }

  render() {
    return (
      <div style={{'marginTop': '10px', 'marginBottom': '5vh'}}>
        <CalendarToolbar
          month={this.state.view === "month" ? moment(this.state.date).format("MMMM YYYY") :
            moment(this.state.date).subtract(2, 'days').format("MMMM YYYY")}
          monthActive={this.state.view === "month"}
          leftDisabled={this.props.allowEditation && moment(this.state.date).isBefore(moment())}
          rightDisabled={!this.props.allowEditation && moment(this.state.date).add(1, "day").isAfter(moment())}
          leftAction={() => this.changeDate(true)}
          rightAction={() => this.changeDate(false)}
          onViewChange={this.changeView}
        />
        <BigCalendar
          messages={this.localization}
          date={this.state.date}
          events={this.props.events}
          onView={(view) => this.props.onDateChange(moment(this.state.date), view)}
          onNavigate={this.onNavigate}
          view={this.state.view}
          views={['work_week', 'month']}
          style={{ height: "85vh" }}
          timeslots={1}
          eventPropGetter={this.eventStyler}
          onSelectEvent={this.onSelectEvent}
          titleAccessor={this.generateTitle}
          startAccessor={(event) => { return new Date(event.massage.date) }}
          endAccessor={(event) => { return new Date(event.massage.ending) }}
          selectable={Auth.isAdmin() && this.props.allowEditation && this.state.view === 'work_week'}
          onSelectSlot={this.props.onAdd}
          min={new Date("2018-01-01T07:30:00")}
          max={new Date("2018-01-01T16:00:00")}
          popup={true}
          toolbar={false}
        />

        <div className="row text-center" style={{'marginTop': '16px'}}>
          <div className="col-md-12">
            <strong>{ _t.translate('Legend:') }</strong>
            <span style={{ backgroundColor: "#2fad2f", borderRadius: "4px", padding: "8px", marginLeft: "8px" }}>
              { _t.translate("Free massage") }
            </span>
            {this.props.allowEditation ?
              <span style={{ backgroundColor: "#ee9d2a", borderRadius: "4px", padding: "8px", marginLeft: "8px" }}>
                { _t.translate("My massage") }
              </span> : ''
            }
            <span style={{ backgroundColor: "#d10a14", borderRadius: "4px", padding: "8px", marginLeft: "8px" }}>
              { _t.translate("Assigned massage") }
            </span>
          </div>
        </div>

        {this.state.active ?
          <MassageEventModal
            event={this.state.selectedEvent}
            label={this.state.label}
            disabled={this.state.overtime}
            allowEditation={this.props.allowEditation}
            onClose={this.handleToggle}
            onEdit={this.editEvent}
            onDelete={this.deleteEvent}
            onConfirm={() => {
              this.handleToggle();
              switch (this.state.action) {
                case "assign":
                  this.props.onAssign(this.state.selectedEvent.massage);
                  break;
                case "cancel":
                  this.props.onCancel(this.state.selectedEvent.massage);
                  break;
                case "none":
                  break;
                default:
                  Util.notify("error", "", _t.translate('An error occured!'));
              }
              this.setState({selectedEvent: null});
            }}
          />
             : ''
        }
      </div>
    );
  }
}

CalendarPanel.propTypes = {
  /** events featured in the calendar */
  events: PropTypes.arrayOf(PropTypes.object).isRequired,
  /** all currently selected events */
  selected: PropTypes.arrayOf(PropTypes.object).isRequired,
  /** whether multi event selection should be activated */
  selectEvents: PropTypes.bool.isRequired,
  /** whether non-delete administration should be enabled (false if archive) */
  allowEditation: PropTypes.bool.isRequired,
  /** number of currently used Massage time in minutes */
  massageMinutes: PropTypes.number,
  /** function called on event assignment */
  onAssign: PropTypes.func,
  /** function called on event cancellation */
  onCancel: PropTypes.func,
  /** function called on selected slot event addition */
  onAdd: PropTypes.func,
  /** function called on event editation */
  onEdit: PropTypes.func,
  /** function called on event deletion */
  onDelete: PropTypes.func.isRequired,
  /** function called on view change */
  onDateChange: PropTypes.func.isRequired,
  /** function called on event selection */
  onSelect: PropTypes.func.isRequired
}

CalendarPanel.defaultProps = {
    allowEditation: true
}

export default CalendarPanel
