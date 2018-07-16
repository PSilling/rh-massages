// react imports
import React, { Component } from 'react';
import PropTypes from 'prop-types';

// module imports
import Datetime from 'react-datetime';

// util imports
import Util from '../../util/Util';
import _t from '../../util/Translations';

/**
 * Multiple Massage filtering elements (search field, from and to date inputs, free checkbox)
 * used in Massage tables.
 */
class MassageFilter extends Component {

  render() {
    return (
      <div className="row">
        <div className="col-md-5">
          <div className="input-group" style={{ 'marginBottom': '15px' }}>
              <span className="input-group-addon"><span className="glyphicon glyphicon-search"></span></span>
              <input type="search" value={this.props.value} className="form-control"
                placeholder={ _t.translate('Search') } onChange={this.props.onSearchChange}
                autoFocus onFocus={Util.moveCursorToEnd}
              />
          </div>
        </div>

        <div className="form-group col-md-5">
          <div className="col-md-5 col-md-offset-1">
          <Datetime id="fromInput" value={this.props.from}
            onChange={this.props.onFromChange} timeFormat={false} />
          </div>

          <div className="col-md-1" style={{ 'marginTop': '6px' }}>
            <label htmlFor="toInput">{ "–" }</label>
          </div>

          <div className="col-md-5">
            <Datetime id="toInput" value={this.props.to}
              onChange={this.props.onToChange} timeFormat={false} />
          </div>
        </div>

        <div className="form-group col-md-2" style={{ 'marginTop': '6px' }}>
          <label className="checkbox-inline">
            <input type="checkbox" onChange={this.props.onCheck} checked={this.props.checked} />
            <strong>{ _t.translate('only free massages') }</strong>
          </label>
        </div>
      </div>
    );
  }
}

MassageFilter.propTypes = {
  /** current value of the search input */
  value: PropTypes.string,
  /** current value of the from date input (string if invalid) */
  from: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.object
  ]),
  /** current value of the to date input (string if invalid) */
  to: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.object
  ]),
  /** whether the free Massages only checkbox should be checked */
  checked: PropTypes.bool,
  /** function called on free Massages only checkbox change */
  onCheck: PropTypes.func,
  /** function called on from date value change */
  onFromChange: PropTypes.func,
  /** function called on to date value change */
  onToChange: PropTypes.func,
  /** function called on search value change */
  onSearchChange: PropTypes.func
};

export default MassageFilter
