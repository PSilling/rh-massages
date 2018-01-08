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
      <div className="text-center">
        <button className="btn btn-link"
          onClick={() => this.props.onChange(-1)}
          disabled={this.props.page >= (this.props.massages / Util.MASSAGES_PER_PAGE)}>
          { _t.translate('Show all') }
        </button>
        <button className="btn btn-link" onClick={() => this.props.onChange(this.props.page + 1)}
          disabled={this.props.page >= (this.props.massages / Util.MASSAGES_PER_PAGE)}>
          { _t.translate('More') }
        </button>
        <button className="btn btn-link" onClick={() => this.props.onChange(this.props.page - 1)}
          disabled={this.props.page <= 1}>
          { _t.translate('Less') }
        </button>
        <button className="btn btn-link" onClick={() => this.props.onChange(1)}
          disabled={this.props.page <= 1}>
          { _t.translate('Collapse all') }
        </button>
      </div>
    );
  }
}

Pager.propTypes = {
  page: PropTypes.number, // current page number
  massages: PropTypes.number, // total number of Massages on the page
  onChange: PropTypes.func // function called on page change
};

export default Pager
