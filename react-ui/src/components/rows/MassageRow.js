// react imports
import React, { Component } from 'react';
import PropTypes from 'prop-types';

// component imports
import AssignButton from '../buttons/AssignButton';
import CancelButton from '../buttons/CancelButton';
import CalendarButton from '../iconbuttons/CalendarButton';
import EditButton from '../iconbuttons/EditButton';
import ForceCancelButton from '../buttons/ForceCancelButton';
import DeleteButton from '../iconbuttons/DeleteButton';

// module imports
import moment from 'moment';

// util imports
import Auth from '../../util/Auth';
import _t from '../../util/Translations';
import Util from '../../util/Util';

/**
 * Custom table row for Massages
 */
class MassageRow extends Component {

  shouldComponentUpdate(nextProps) {
    return (this.props.checked !== nextProps.checked
      || this.props.assignDisabled !== nextProps.assignDisabled
      || this.props.massage.id !== nextProps.massage.id
      || this.props.massage.masseuse !== nextProps.massage.masseuse
      || this.props.massage.client !== nextProps.massage.client
      || this.props.massage.date !== nextProps.massage.date
      || this.props.massage.ending !== nextProps.massage.ending);
  }

  render() {
    return (
      <tr>
        {Auth.isAdmin() ?
          <td width="40px" className="text-center">
            <input type="checkbox" onChange={this.props.onCheck} checked={this.props.checked} />
          </td> : <td className="hidden"></td>
        }
        <td>{moment(this.props.massage.date).format("dd DD. MM.")}</td>
        <td>
          {moment(this.props.massage.date).format("HH:mm") + "–" + moment(this.props.massage.ending).format("HH:mm")}
        </td>
        <td>{this.props.massage.masseuse}</td>
        {Util.isEmpty(this.props.massage.client) ?
          <td className="success">
            { _t.translate('Free') }
            {moment(this.props.massage.date).isBefore(moment()) ? '' :
              <AssignButton onAssign={this.props.onAssign} disabled={this.props.assignDisabled}>
                <button type="button" className="btn btn-primary"
                  onClick={this.props.onEventAssign} style={{ 'marginRight': '5px' }}>
                  { _t.translate('Proceed and add to calendar') }
                </button>
              </AssignButton>
            }
          </td> :
          <td className={ Auth.getSub() === this.props.massage.client ? "warning" : "danger" }>
            { Auth.getSub() === this.props.massage.client ? _t.translate('Assigned') :
              Util.isEmpty(this.props.massage.contact) ? _t.translate('Full') : _t.translate('Full') + " – " + this.props.massage.contact}

            { Auth.getSub() === this.props.massage.client ? <CancelButton onCancel={this.props.onCancel}
              disabled={(moment(this.props.massage.date).diff(moment(), 'minutes') <= Util.CANCELLATION_LIMIT) && !Auth.isAdmin()} /> : '' }
            { Auth.isAdmin() && Auth.getSub() !== this.props.massage.client ? <ForceCancelButton onCancel={this.props.onCancel} /> : '' }
          </td>
        }
        <td width="55px">
          <CalendarButton disabled={Auth.getSub() !== this.props.massage.client}
            onAdd={() => Util.addToCalendar(this.props.massage)} />
        </td>
        {Auth.isAdmin() ?
          <td width="105px">
            <span className="pull-right">
              <span style={{ 'marginRight': '5px' }}>
                <EditButton onEdit={this.props.onEdit} />
              </span>
              <DeleteButton onDelete={this.props.onDelete} />
            </span>
          </td> : <td className="hidden"></td>
        }
      </tr>
    );
  }
}

MassageRow.propTypes = {
  massage: PropTypes.object.isRequired, // the Massage for this row
  assignDisabled: PropTypes.bool, // whether assingment button should be disabled
  checked: PropTypes.bool, // whether the checkbox is checked
  onCheck: PropTypes.func.isRequired, // function called on checkbox value change
  onAssign: PropTypes.func.isRequired, // function called on Massage assignment
  onEventAssign: PropTypes.func.isRequired, // function called on Massage assignment with calendar event
  onCancel: PropTypes.func.isRequired, // function called on Massage cancellation
  onEdit: PropTypes.func.isRequired, // function called on Massage edit
  onDelete: PropTypes.func.isRequired // function called on Massage delete
};

export default MassageRow
