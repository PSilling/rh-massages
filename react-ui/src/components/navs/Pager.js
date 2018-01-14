// react imports
import React, { Component } from 'react';
import PropTypes from 'prop-types';

// component imports
import Page from '../navs/Page';

// util imports
import Util from '../../util/Util';
import _t from '../../util/Translations';

/**
 * Custom pagination component.
 */
class Pager extends Component {

  renderPages = () => {
    var pages = [];
    for (var i = 1; i <= this.props.pages; i++) {
      if (i < 4 || i > (this.props.pages - 3) || (i > (this.props.page - 5)
        && i < (this.props.page + 5))) {
        let number = i;
        pages.push(
          <Page active={i === this.props.page} number={i} key={i}
            onClick={() => this.props.onPageChange(number)} />
        );
      } else if (i === 4 || i === (this.props.pages - 3)) {
        pages.push(
          <li className="disabled" key={i}>
            <a>
              {"…"}
            </a>
          </li>
        );
      }
    }
    return pages;
  }

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
          <ul className="pagination" style={{ 'marginTop': '0px'}}>
            {this.renderPages()}
          </ul>
        </div>
      </div>
    );
  }
}

Pager.propTypes = {
  page: PropTypes.number, // current page number
  perPage: PropTypes.number, // number of Massages shown per each page
  pages: PropTypes.number, // total number of pages to show
  onPageChange: PropTypes.func, // function called on page change
  onPerPageChange: PropTypes.func // function called on per page count change
};

export default Pager
