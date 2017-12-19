// react imports
import React, { Component } from 'react';

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
          onClick={() => this.props.changeHandler(Math.ceil(this.props.massages / Util.MASSAGES_PER_PAGE))}
          disabled={this.props.page > this.props.massages / Util.MASSAGES_PER_PAGE ? true : false}>
          { _t.translate('Show all') }
        </button>
        <button className="btn btn-link" onClick={() => this.props.changeHandler(this.props.page + 1)}
          disabled={this.props.page > this.props.massages / Util.MASSAGES_PER_PAGE ? true : false}>
          { _t.translate('More') }
        </button>
        <button className="btn btn-link" onClick={() => this.props.changeHandler(this.props.page - 1)}
          disabled={this.props.page <= 1 ? true : false}>
          { _t.translate('Less') }
        </button>
        <button className="btn btn-link" onClick={() => this.props.changeHandler(1)}
          disabled={this.props.page <= 1 ? true : false}>
          { _t.translate('Collapse all') }
        </button>
      </div>
    )
  }
}

export default Pager
