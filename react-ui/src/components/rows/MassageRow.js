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
 * Massage information row for Massages view.
 */
class MassageRow extends Component {

  shouldComponentUpdate(nextProps) {
    return (this.props.checked !== nextProps.checked
      || this.props.assignDisabled !== nextProps.assignDisabled
      || this.props.search !== nextProps.search
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
        <td>{Util.highlightInText(this.props.massage.masseuse, this.props.search)}</td>
        {Util.isEmpty(this.props.massage.client) ?
          <td className="success">
            { _t.translate('Free') }
            {moment(this.props.massage.date).isBefore(moment()) ? '' :
              <AssignButton onAssign={this.props.onAssign} disabled={this.props.assignDisabled}>
                <a href={Util.addToCalendar(this.props.massage)} target="_blank" tabIndex="-1">
                  <button type="button" className="btn btn-primary"
                    onClick={this.props.onAssign} style={{ 'marginRight': '5px' }}>
                    { _t.translate('Proceed and add to calendar') }
                  </button>
                </a>
              </AssignButton>
            }
          </td> :
          <td className={ Auth.getSub() === this.props.massage.client.sub ? "warning" : "danger" }>
            { Util.highlightInText(Util.getContactInfo(this.props.massage.client), this.props.search) }
            { Auth.getSub() === this.props.massage.client.sub ? <CancelButton onCancel={this.props.onCancel}
              disabled={(moment(this.props.massage.date).diff(moment(), 'minutes') <= Util.CANCELLATION_LIMIT) && !Auth.isAdmin()} /> : '' }
            { Auth.isAdmin() && Auth.getSub() !== this.props.massage.client.sub ? <ForceCancelButton onCancel={this.props.onCancel} /> : '' }
          </td>
        }
        <td width="55px">
          <CalendarButton disabled={Util.isEmpty(this.props.massage.client)
            || Auth.getSub() !== this.props.massage.client.sub}
            link={Util.addToCalendar(this.props.massage)} />
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
  /** the Massage for this row */
  massage: PropTypes.object.isRequired,
  /** whether assingment button should be disabled */
  assignDisabled: PropTypes.bool,
  /** whether the checkbox is checked */
  checked: PropTypes.bool,
  /** search string to be highlighted */
  search: PropTypes.string,
  /** function called on checkbox value change */
  onCheck: PropTypes.func.isRequired,
  /** function called on Massage assignment */
  onAssign: PropTypes.func.isRequired,
  /** function called on Massage cancellation */
  onCancel: PropTypes.func.isRequired,
  /** function called on Massage edit */
  onEdit: PropTypes.func.isRequired,
  /** function called on Massage delete */
  onDelete: PropTypes.func.isRequired
};

export default MassageRow
