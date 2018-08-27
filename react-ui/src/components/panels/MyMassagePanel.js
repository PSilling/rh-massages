// react imports
import React, { Component } from 'react';
import PropTypes from 'prop-types';

// component imports
import CalendarButton from '../iconbuttons/CalendarButton';
import ConfirmationModal from '../modals/ConfirmationModal';

// module imports
import moment from 'moment';

// util imports
import Util from '../../util/Util';
import _t from '../../util/Translations';

/**
 * Massage information panel for My Massages view.
 */
class MyMassagePanel extends Component {

  state = {active: false}

  shouldComponentUpdate(nextProps, nextState) {
    return (this.props.type !== nextProps.type
         || this.props.massage.masseuse !== nextProps.massage.masseuse
         || this.props.massage.date !== nextProps.massage.date
         || this.props.massage.ending !== nextProps.massage.ending
         || this.state.active !== nextState.active);
  }

  handleToggle = () => {
    this.setState({active: !this.state.active});
  }

  cancelMassage = () => {
    Util.put(Util.MASSAGES_URL, [{
      id: this.props.massage.id,
      date: this.props.massage.date,
      ending: this.props.massage.ending,
      masseuse: this.props.massage.masseuse,
      client: null,
      facility: this.props.massage.facility
    }], this.props.getCallback);
  }

  render() {
    return (
      <div>
        <div className="col-md-3">
          <div className={"panel panel-" + this.props.type} style={{ 'height': '15em' }}>
            <div className="panel-heading">
              {moment(this.props.massage.date).format("dd DD. MM.") + _t.translate(' in ') + this.props.massage.facility.name}
              <button type="button" className="close" aria-label="Close"
                onClick={this.handleToggle} title={ _t.translate('Unassign me') }>
                {this.props.disabled ?
                  '' : <span aria-hidden="true">&times;</span>}
              </button>
            </div>
            <div className="panel-body">
              <p>
                {_t.translate('Facility') + ": " + this.props.massage.facility.name}
              </p>
              <p>
                {_t.translate('Masseur/Masseuse') + ": " + this.props.massage.masseuse}
              </p>
              <p>
                {_t.translate('Time') + ": " + moment(this.props.massage.date).format("HH:mm")
                  + "–" + moment(this.props.massage.ending).format("HH:mm")}
              </p>
              <p style={{ 'marginTop': '-8px' }}>
                {_t.translate('Event') + ":"}
                <CalendarButton link={Util.addToCalendar(this.props.massage)} />
              </p>
            </div>
          </div>
        </div>
        {this.state.active ?
          <ConfirmationModal
            message={ _t.translate('Are you sure you want to unassign yourself from this massage?') }
            onClose={this.handleToggle}
            onConfirm={() => {
              this.handleToggle();
              this.cancelMassage();
            }}
          /> : ''
        }
      </div>
    );
  }
}

MyMassagePanel.propTypes = {
  /** type of the Bootstrap panel */
  type: PropTypes.string.isRequired,
  /** Massage to be printed inside the panel */
  massage: PropTypes.object.isRequired,
  /** update callback function called on Massage cancellation */
  getCallback: PropTypes.func,
  /** whether the removal button should be hidden or not */
  disabled: PropTypes.bool
};

MyMassagePanel.defaultProps = {
  type: "default",
  disabled: true
};

export default MyMassagePanel
