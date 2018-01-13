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
 * Custom panel component that contains Massage information.
 */
class MassagePanel extends Component {

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
    Util.put(Util.MASSAGES_URL + "?ids=" + this.props.massage.id, [{
      date: this.props.massage.date,
      ending: this.props.massage.ending,
      masseuse: this.props.massage.masseuse,
      client: null,
      contact: null,
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
                onClick={this.handleToggle} title={ _t.translate('Cancel') }>
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
                <CalendarButton onAdd={() => Util.addToCalendar(this.props.massage)} />
              </p>
            </div>
          </div>
        </div>
        {this.state.active ?
          <ConfirmationModal
            message={ _t.translate('Are you sure you want to cancel this massage?') }
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

MassagePanel.propTypes = {
  type: PropTypes.string.isRequired, // type of the Bootstrap panel
  massage: PropTypes.object.isRequired, // Massage to be printed inside the panel
  getCallback: PropTypes.func, // update callback function called on Massage cancellation
  disabled: PropTypes.bool // whether the removal button should be hidden or not
};

MassagePanel.defaultProps = {
  type: "default",
  disabled: true
};

export default MassagePanel
