// react imports
import React, { Component } from "react";
import PropTypes from "prop-types";

// module imports
import { Row, Col } from "reactstrap";
import moment from "moment";
import BigCalendar from "react-big-calendar";

// component imports
import CalendarToolbar from "../util/CalendarToolbar";
import MassageEvent from "./components/MassageEvent";
import MassageEventModal from "../modals/MassageEventModal";
import WeekdayHeader from "./components/WeekdayHeader";

// util imports
import Auth from "../../util/Auth";
import _t from "../../util/Translations";
import Util from "../../util/Util";

const localizer = BigCalendar.momentLocalizer(moment);

/**
 * Calendar with massage events. Supports color feedback and Massage administration.
 */
class CalendarPanel extends Component {
  state = {
    active: false,
    action: "",
    selectedEvent: null,
    label: "",
    overtime: false,
    date: new Date(),
    view: this.props.allowEditation ? "work_week" : "month"
  };

  localization = {
    allDay: _t.translate("All day"),
    date: _t.translate("Date"),
    time: _t.translate("Time"),
    event: _t.translate("Event"),
    showMore: total => `+ ${_t.translate("Show more")} (${total})`
  };

  formats = {
    dayFormat: (date, culture, local) => local.format(date, _t.translate("DD ddd"), culture),
    eventTimeRangeFormat: () => null
  };

  doubleClick = false;

  eventStyler = event => ({
    style: {
      backgroundColor: event.bgColor,
      color: "black",
      border: 0,
      borderRadius: "4px",
      marginLeft: this.state.view === "month" ? "0px" : "5px",
      opacity: Util.findInArrayById(this.props.selected, event.massage.id) !== -1 ? "0.8" : "1.0"
    }
  });

  onSelectEvent = event => {
    if (this.props.selectEvents) {
      this.props.onSelect(event);
    } else if (this.props.allowEditation) {
      this.props.onTooltipTrigger(`MassageEventID${event.massage.id}`);
    } else {
      this.setState({ active: true, action: "none", label: "none", selectedEvent: event });
      this.props.onTooltipTrigger(null);
    }
  };

  onEventDoubleClick = event => {
    if (this.props.allowEditation) {
      this.configureModalActions(event);
    } else {
      this.setState({ active: true, action: "none", label: "none", selectedEvent: event });
    }
    this.props.onTooltipTrigger(null);
  };

  handleEventSelect = event => {
    setTimeout(() => {
      this.doubleClick = false;
    }, 500);

    if (this.doubleClick) {
      this.onEventDoubleClick(event);
    }

    this.onSelectEvent(event);
    this.doubleClick = !this.doubleClick;
  };

  /**
   * Configures MassageEventModal buttons based on event client assignment status.
   */
  configureModalActions = event => {
    if (Util.isEmpty(event.massage.client)) {
      if (
        this.props.massageMinutes + moment(event.massage.ending).diff(moment(event.massage.date), "minutes") >
        Util.MAX_MASSAGE_MINS
      ) {
        this.setState({
          active: true,
          action: "none",
          selectedEvent: event,
          label: _t.translate("Assign me"),
          overtime: true
        });
      } else {
        this.setState({
          active: true,
          action: "assign",
          selectedEvent: event,
          label: _t.translate("Assign me"),
          overtime: false
        });
      }
    } else if (Auth.getSub() === event.massage.client.sub) {
      this.setState({
        active: true,
        action: "cancel",
        selectedEvent: event,
        label: _t.translate("Unassign me"),
        overtime: false
      });
    } else if (Auth.isAdmin() || (Auth.isMasseur() && Auth.getSub() === event.massage.masseuse.sub)) {
      this.setState({
        active: true,
        action: "cancel",
        selectedEvent: event,
        label: _t.translate("Remove client"),
        overtime: false
      });
    } else {
      this.setState({
        active: true,
        action: "none",
        selectedEvent: event,
        label: "none",
        overtime: false
      });
    }
  };

  editEvent = () => {
    this.props.onEdit(this.state.selectedEvent.massage);
    this.setState({ active: false });
  };

  deleteEvent = () => {
    this.props.onDelete(this.state.selectedEvent.massage.id);
    this.setState({ active: false });
  };

  handleToggle = () => {
    this.setState(prevState => ({ active: !prevState.active }));
    this.props.onTooltipTrigger(null);
  };

  changeView = view => {
    this.setState({ view });

    if (this.props.selectEvents && view === this.state.view) {
      this.props.onMultiSelect(this.state.date, view === "month" ? "month" : "isoWeek");
    } else {
      this.props.onDateChange(this.state.date, view);
    }
  };

  changeDate = left => {
    this.setState(prevState => {
      const dateAsMoment = moment(prevState.date);
      const modifier = prevState.view === "month" ? "month" : "week";

      if (left) {
        dateAsMoment.subtract(1, modifier);
      } else {
        dateAsMoment.add(1, modifier);
      }

      const newDate = dateAsMoment.toDate();
      this.props.onDateChange(newDate, prevState.view);
      return { date: newDate };
    });
  };

  render() {
    return (
      <div className="mb-3">
        <Row>
          <Col md="12">
            <CalendarToolbar
              month={
                this.state.view === "month"
                  ? moment(this.state.date).format("MMMM YYYY")
                  : moment(this.state.date)
                      .subtract(2, "days")
                      .format("MMMM YYYY")
              }
              monthActive={this.state.view === "month"}
              leftDisabled={this.props.allowEditation && moment(this.state.date).isBefore(moment())}
              rightDisabled={
                !this.props.allowEditation &&
                moment(this.state.date)
                  .add(1, "day")
                  .isAfter(moment())
              }
              leftAction={() => this.changeDate(true)}
              rightAction={() => this.changeDate(false)}
              onViewChange={this.changeView}
            />
            <BigCalendar
              messages={this.localization}
              date={this.state.date}
              events={this.props.events}
              onView={view => this.props.onDateChange(moment(this.state.date), view)}
              onNavigate={() => {}}
              view={this.state.view}
              views={["work_week", "month"]}
              style={{ height: "85vh" }}
              timeslots={1}
              eventPropGetter={this.eventStyler}
              onSelectEvent={this.handleEventSelect}
              startAccessor={event => new Date(event.massage.date)}
              endAccessor={event => new Date(event.massage.ending)}
              selectable={Auth.isAdminOrMasseur() && this.props.allowEditation && this.state.view === "work_week"}
              onSelectSlot={this.props.onAdd}
              min={new Date("2018-01-01T08:30:00")}
              max={new Date("2018-01-01T18:00:00")}
              popup
              toolbar={false}
              localizer={localizer}
              formats={this.formats}
              components={{
                event: props => (
                  <MassageEvent
                    event={props.event}
                    archived={!this.props.allowEditation}
                    activeTooltip={this.props.activeEventTooltip}
                    massageMinutes={this.props.massageMinutes}
                    onAssign={this.props.onAssign}
                    onCancel={this.props.onCancel}
                    onDelete={this.props.onDelete}
                    onEdit={this.props.onEdit}
                    onShowMore={this.onEventDoubleClick}
                    view={this.state.view}
                  />
                ),
                work_week: {
                  header: props =>
                    WeekdayHeader(props, Auth.isAdminOrMasseur() && this.props.selectEvents, date =>
                      this.props.onMultiSelect(date, "day")
                    )
                }
              }}
            />
          </Col>
        </Row>

        <Row className="text-center mt-3">
          <Col md="12">
            <strong>{_t.translate("Key:")}</strong>
            <span
              style={{ backgroundColor: Util.SUCCESS_COLOR, borderRadius: "4px", padding: "8px", marginLeft: "8px" }}
            >
              {_t.translate("Free massage")}
            </span>
            {this.props.allowEditation && (
              <span
                style={{ backgroundColor: Util.WARNING_COLOR, borderRadius: "4px", padding: "8px", marginLeft: "8px" }}
              >
                {_t.translate("My massage")}
              </span>
            )}
            <span style={{ backgroundColor: Util.ERROR_COLOR, borderRadius: "4px", padding: "8px", marginLeft: "8px" }}>
              {_t.translate("Assigned massage")}
            </span>
          </Col>
        </Row>

        {this.state.active && (
          <MassageEventModal
            event={this.state.selectedEvent}
            label={this.state.label}
            disabled={this.state.overtime}
            onClose={this.handleToggle}
            onEdit={this.editEvent}
            onDelete={this.deleteEvent}
            allowEditation={this.props.allowEditation}
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
                  Util.notify("error", "", _t.translate("An error occured!"));
              }
              this.setState({ selectedEvent: null });
            }}
          />
        )}
      </div>
    );
  }
}

CalendarPanel.propTypes = {
  /** events featured in the calendar */
  events: PropTypes.arrayOf(
    PropTypes.shape({
      bgColor: PropTypes.string,
      massage: PropTypes.shape({
        id: PropTypes.number,
        masseuse: PropTypes.shape({
          email: PropTypes.string,
          masseur: PropTypes.bool,
          name: PropTypes.string,
          sub: PropTypes.string,
          subscribed: PropTypes.bool,
          surname: PropTypes.string
        }),
        date: PropTypes.oneOfType([PropTypes.number, PropTypes.instanceOf(Date)]),
        ending: PropTypes.oneOfType([PropTypes.number, PropTypes.instanceOf(Date)]),
        client: PropTypes.shape({
          email: PropTypes.string,
          name: PropTypes.string,
          surname: PropTypes.string,
          sub: PropTypes.string,
          subscribed: PropTypes.bool
        }),
        facility: PropTypes.shape({
          id: PropTypes.number,
          name: PropTypes.string
        })
      })
    })
  ).isRequired,
  /** function called on event deletion */
  onDelete: PropTypes.func.isRequired,
  /** function called on event selection */
  onSelect: PropTypes.func.isRequired,
  /** function called on full multiple event selection */
  onMultiSelect: PropTypes.func.isRequired,
  /** all currently selected events */
  selected: PropTypes.arrayOf(
    PropTypes.shape({
      bgColor: PropTypes.string,
      massage: PropTypes.shape({
        id: PropTypes.number,
        masseuse: PropTypes.shape({
          email: PropTypes.string,
          masseur: PropTypes.bool,
          name: PropTypes.string,
          sub: PropTypes.string,
          subscribed: PropTypes.bool,
          surname: PropTypes.string
        }),
        date: PropTypes.oneOfType([PropTypes.number, PropTypes.instanceOf(Date)]),
        ending: PropTypes.oneOfType([PropTypes.number, PropTypes.instanceOf(Date)]),
        client: PropTypes.shape({
          email: PropTypes.string,
          name: PropTypes.string,
          surname: PropTypes.string,
          sub: PropTypes.string,
          subscribed: PropTypes.bool
        }),
        facility: PropTypes.shape({
          id: PropTypes.number,
          name: PropTypes.string
        })
      })
    })
  ).isRequired,
  /** whether multi event selection should be activated */
  selectEvents: PropTypes.bool.isRequired,
  /** currently active event tooltip target */
  activeEventTooltip: PropTypes.string,
  /** whether the edit button should be shown (Admin only) */
  allowEditation: PropTypes.bool,
  /** number of currently used Massage time in minutes */
  massageMinutes: PropTypes.number,
  /** function called on selected slot event addition */
  onAdd: PropTypes.func,
  /** function called on event assignment */
  onAssign: PropTypes.func,
  /** function called on event cancellation */
  onCancel: PropTypes.func,
  /** function called on view change */
  onDateChange: PropTypes.func,
  /** function called on event editation */
  onEdit: PropTypes.func,
  /** function called on event tooltip toggle trigger */
  onTooltipTrigger: PropTypes.func
};

CalendarPanel.defaultProps = {
  activeEventTooltip: null,
  allowEditation: true,
  massageMinutes: 0,
  onAdd() {},
  onAssign() {},
  onCancel() {},
  onDateChange() {},
  onEdit() {},
  onTooltipTrigger() {}
};

export default CalendarPanel;
