// react imports
import React, { Component } from 'react';
import PropTypes from 'prop-types';

// component imports
import DeleteButton from '../iconbuttons/DeleteButton';

// module imports
import moment from 'moment';

// util imports
import _t from '../../util/Translations';
import Util from '../../util/Util';

/**
 * Massage information row for Massages Archive view.
 */
class ArchiveMassageRow extends Component {

  shouldComponentUpdate(nextProps) {
    return (this.props.massage.id !== nextProps.massage.id
    || this.props.search !== nextProps.search);
  }

  render() {
    return (
      <tr>
        <td>{Util.highlightInText(this.props.massage.facility.name, this.props.search)}</td>
        <td>{moment(this.props.massage.date).format("dd DD. MM. YYYY")}</td>
        <td>
          {moment(this.props.massage.date).format("HH:mm") + "–"
            + moment(this.props.massage.ending).format("HH:mm")}
        </td>
        <td>{Util.highlightInText(this.props.massage.masseuse, this.props.search)}</td>
        {Util.isEmpty(this.props.massage.client) ?
          <td className="success">
            { _t.translate('Free') }
          </td> :
          <td className="danger">
            {Util.isEmpty(this.props.massage.client) ? _t.translate('Full')
              : Util.highlightInText(Util.getContactInfo(this.props.massage.client), this.props.search)}
          </td>
        }
        <td width="75px" className={Util.isEmpty(this.props.massage.client) ? "success" : "danger"}>
          <span className="pull-right">
            <DeleteButton onDelete={this.props.onDelete} />
          </span>
        </td>
      </tr>
    );
  }
}

ArchiveMassageRow.propTypes = {
  /** the Massage for this row */
  massage: PropTypes.object.isRequired,
  /** search string to be highlighted */
  search: PropTypes.string,
  /** function called on Massage delete */
  onDelete: PropTypes.func.isRequired
};

export default ArchiveMassageRow
