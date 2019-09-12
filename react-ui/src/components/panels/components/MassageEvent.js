// react imports
import React, { Component } from "react";
import PropTypes from "prop-types";

// module imports
import { Tooltip } from "reactstrap";
import moment from "moment";

// component imports
import ConfirmationModal from "../../modals/ConfirmationModal";
import TooltipIconButton from "../../iconbuttons/TooltipIconButton";

// util imports
import _t from "../../../util/Translations";
import Auth from "../../../util/Auth";
import Util from "../../../util/Util";

/**
 * Custom component event for Massages calendar view.
 */
class MassageEvent extends Component {
  // note that this can cause re-render issues (number overflow); haven't found a better solution though
  tooltipTarget = Util.getTooltipTargets(1)[0];

  hoverChangeTimeout = null;

  constructor(props) {
    super(props);

    this.state = { modalActive: false, tooltipOpen: false, hovered: false };
  }

  assignWithCalendar = () => {
    window.open(Util.getEventLink(this.props.event.massage), "_blank");
    this.props.onAssign(this.props.event.massage);
  };

  setHover = () => {
    clearTimeout(this.hoverChangeTimeout);
    this.setState({ hovered: true });
  };

  dropHover = () => {
    this.hoverChangeTimeout = setTimeout(
      () => {
        this.setState({ hovered: false });
      },
      this.props.view === "work_week" ? 75 : 400
    );
  };

  toggleTooltip = () => {
    this.setState(prevState => ({ tooltipOpen: !prevState.tooltipOpen }));
  };

  toggleModal = () => {
    this.setState(prevState => ({
      modalActive: !prevState.modalActive,
      tooltipOpen: prevState.modalActive ? prevState.tooltipOpen : false
    }));
  };

  createTimeInfo = () => (
    <span className="rbc-event-label" style={{ marginTop: "2px", marginBottom: "3px" }}>
      {`${moment(this.props.event.massage.date).format("LT")} — ${moment(this.props.event.massage.ending).format(
        "LT"
      )}`}
    </span>
  );

  createClientInfo = (forMasseur = true) => (
    <span>
      <nobr>
        {this.props.archived && `${this.props.event.massage.facility.name}: `}
        {forMasseur
          ? this.props.event.massage.masseuse.name
          : `${this.props.event.massage.client.name} ${this.props.event.massage.client.surname}`}
      </nobr>
    </span>
  );

  createIcons = () => {
    const icons = [];

    if (!Auth.isMasseur() && Util.isEmpty(this.props.event.massage.client)) {
      const assignDisabled =
        this.props.massageMinutes +
          moment(this.props.event.massage.ending).diff(moment(this.props.event.massage.date), "minutes") >
        Util.MAX_MASSAGE_MINS;
      const title = assignDisabled ? _t.translate("Over the limit") : "";
      icons.push(
        <span key="assignCal" title={title}>
          <TooltipIconButton
            icon="calendar-plus"
            size="md"
            onClick={this.assignWithCalendar}
            disabled={assignDisabled}
          />
        </span>
      );
      icons.push(
        <span key="assign" title={title}>
          <TooltipIconButton
            icon="check"
            size="md"
            onClick={() => this.props.onAssign(this.props.event.massage)}
            disabled={assignDisabled}
          />
        </span>
      );
    } else if (
      !Util.isEmpty(this.props.event.massage.client) &&
      Auth.getSub() === this.props.event.massage.client.sub
    ) {
      icons.push(
        <TooltipIconButton
          key="onlyCal"
          icon="calendar-plus"
          size="md"
          onClick={() => window.open(Util.getEventLink(this.props.event.massage), "_blank")}
        />
      );
      icons.push(
        <TooltipIconButton
          key="cancel"
          icon="times"
          size="md"
          onClick={() => this.props.onCancel(this.props.event.massage)}
        />
      );
    } else if (
      !Util.isEmpty(this.props.event.massage.client) &&
      (Auth.isAdmin() || (Auth.isMasseur() && this.props.event.massage.masseuse.sub === Auth.getSub()))
    ) {
      icons.push(
        <TooltipIconButton
          key="force-cancel"
          icon="times"
          size="md"
          onClick={() => this.props.onCancel(this.props.event.massage)}
        />
      );
    }

    if (Auth.isAdmin() || (Auth.isMasseur() && this.props.event.massage.masseuse.sub === Auth.getSub())) {
      icons.push(
        <TooltipIconButton
          key="edit"
          icon="edit"
          size="md"
          onClick={() => this.props.onEdit(this.props.event.massage)}
        />
      );
      icons.push(<TooltipIconButton key="delete" icon="trash" size="md" onClick={this.toggleModal} />);
    }

    icons.push(
      <TooltipIconButton
        key="more"
        icon="ellipsis-v"
        size="md"
        onClick={() => this.props.onShowMore(this.props.event)}
      />
    );

    return icons;
  };

  render() {
    return (
      <div
        id={this.tooltipTarget}
        style={{ minHeight: "100%", minWidth: "100%" }}
        onMouseEnter={this.setHover}
        onMouseLeave={this.dropHover}
      >
        {this.props.view === "work_week" ? (
          <span>
            {this.createTimeInfo()}
            {this.createClientInfo(!this.state.hovered || Util.isEmpty(this.props.event.massage.client))}
          </span>
        ) : (
          <span>{this.state.hovered ? this.createTimeInfo() : this.createClientInfo()}</span>
        )}

        {this.props.activeTooltip === `MassageEventID${this.props.event.massage.id}` && !this.props.archived && (
          <Tooltip
            isOpen={this.state.tooltipOpen}
            toggle={this.toggleTooltip}
            target={this.tooltipTarget}
            autohide={false}
          >
            <div style={{ marginLeft: "-2px", marginRight: "-2px" }}>{this.createIcons()}</div>
          </Tooltip>
        )}
        {this.state.modalActive && (
          <ConfirmationModal
            message={_t.translate("Are you sure? This action cannot be reverted.")}
            onClose={this.toggleModal}
            onConfirm={() => {
              this.toggleModal();
              this.props.onDelete(this.props.event.massage.id);
            }}
          />
        )}
      </div>
    );
  }
}

MassageEvent.propTypes = {
  /** event to be rendered */
  event: PropTypes.shape({
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
  }).isRequired,
  /** whether the event is to be displayed as archived or not */
  archived: PropTypes.bool,
  /** whether the event tooltip should be visible or not */
  activeTooltip: PropTypes.string,
  /** number of currently used Massage time in minutes */
  massageMinutes: PropTypes.number,
  /** function called on event assignment */
  onAssign: PropTypes.func,
  /** function called on event cancellation */
  onCancel: PropTypes.func,
  /** function called on event deletion */
  onDelete: PropTypes.func,
  /** function called on event editation */
  onEdit: PropTypes.func,
  /** function called on event more info request */
  onShowMore: PropTypes.func,
  /** current calendar view */
  view: PropTypes.string
};

MassageEvent.defaultProps = {
  archived: false,
  activeTooltip: null,
  massageMinutes: 0,
  onAssign() {},
  onCancel() {},
  onDelete() {},
  onEdit() {},
  onShowMore() {},
  view: "month"
};

export default MassageEvent;
