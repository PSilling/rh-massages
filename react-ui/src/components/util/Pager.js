// react imports
import React, { Component } from 'react';
import PropTypes from 'prop-types';

// util imports
import Util from '../../util/Util';
import _t from '../../util/Translations';

/**
 * Custom pagination component.
 */
class Pager extends Component {

  render() {
    return(
      <div style={{ 'marginBottom': '20px' }}>
        <div className="pull-right">
          <input id="perPageInput" value={this.props.perPage} onChange={this.props.onPerPageChange}
            className="form-control" onFocus={Util.moveCursorToEnd}
            type="number" min="5" max="50" placeholder={ _t.translate('Per page') }
          />
        </div>
        <div className="pull-right">
          <label htmlFor="perPageInput" style={{ 'marginRight': '6px', 'marginTop': '6px' }}>
            { _t.translate('Per page') + ":" }
          </label>
        </div>

        <div className="text-center">
          <button className="btn btn-link"
            onClick={() => this.props.onPageChange(-1)}
            disabled={this.props.page >= (this.props.massages / this.props.perPage)}>
            { _t.translate('Show all') }
          </button>
          <button className="btn btn-link" onClick={() => this.props.onPageChange(this.props.page + 1)}
            disabled={this.props.page >= (this.props.massages / this.props.perPage)}>
            { _t.translate('More') }
          </button>
          <button className="btn btn-link" onClick={() => this.props.onPageChange(this.props.page - 1)}
            disabled={this.props.page <= 1}>
            { _t.translate('Less') }
          </button>
          <button className="btn btn-link" onClick={() => this.props.onPageChange(1)}
            disabled={this.props.page <= 1}>
            { _t.translate('Collapse all') }
          </button>
        </div>
      </div>
    );
  }
}

Pager.propTypes = {
  page: PropTypes.number, // current page number
  perPage: PropTypes.number, // number of Massages shown per each page
  massages: PropTypes.number, // total number of Massages on the page
  onPerPageChange: PropTypes.func, // function called on per page count change
  onPageChange: PropTypes.func // function called on page change
};

export default Pager
