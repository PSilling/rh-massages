// react imports
import React, { Component } from 'react';
import PropTypes from 'prop-types';

// util imports
import Auth from '../../util/Auth';
import Util from '../../util/Util';
import _t from '../../util/Translations';

/**
 * Multiple Massage filtering elements (search field, free checkbox) used with event calendars.
 * For administrators also provides management features (event selection).
 */
class MassageFilter extends Component {

  render() {
    return (
      <div className="row">
        <div className={Auth.isAdmin() ? "col-md-8" : "col-md-10"}>
          <div className="input-group" style={{ 'marginBottom': '15px' }}>
              <span className="input-group-addon"><span className="glyphicon glyphicon-search"></span></span>
              <input type="search" value={this.props.filter} className="form-control"
                placeholder={ _t.translate('Filtering') } onChange={this.props.onFilterChange}
                autoFocus onFocus={Util.moveCursorToEnd}
              />
          </div>
        </div>

        {Auth.isAdmin() && this.props.enableSelect ?
          <div>
            <div className="form-group col-md-4 text-right" style={{ 'marginTop': '6px' }}>
              <label className="checkbox-inline">
                <input type="checkbox" onChange={this.props.onFreeCheck} checked={this.props.free} />
                <strong>{ _t.translate('only free massages') }</strong>
              </label>

              <label className="checkbox-inline">
                <input type="checkbox" onChange={this.props.onSelectCheck} checked={this.props.select} />
                <strong>{ _t.translate('select events') }</strong>
              </label>
            </div>
          </div> :
          <div className="form-group col-md-2 text-right" style={{ 'marginTop': '6px' }}>
            <label className="checkbox-inline">
              <input type="checkbox" onChange={this.props.onFreeCheck} checked={this.props.free} />
              <strong>{ _t.translate('only free massages') }</strong>
            </label>
          </div>
        }
      </div>
    );
  }
}

MassageFilter.propTypes = {
  /** current value of the filter input */
  filter: PropTypes.string,
  /** whether the select events checkbox should be checked */
  select: PropTypes.bool,
  /** whether the free Massages only checkbox should be checked */
  free: PropTypes.bool,
  /** whether the select checkbox should be disabled */
  enableSelect: PropTypes.bool,
  /** function called on select events checkbox change */
  onSelectCheck: PropTypes.func,
  /** function called on free Massages only checkbox change */
  onFreeCheck: PropTypes.func,
  /** function called on filter value change */
  onFilterChange: PropTypes.func
};

MassageFilter.defaultProps = {
  enableSelect: true
};

export default MassageFilter
