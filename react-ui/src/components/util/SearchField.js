// react imports
import React, { Component } from 'react';

// util imports
import _t from '../../util/Translations';

/**
 * Custom search input component.
 */
class SearchField extends Component {

  render() {
    return(
      <form>
        <div className="input-group">
          <span className="input-group-addon"><span className="glyphicon glyphicon-search"></span></span>
          <input type="search" value={this.props.value} className="form-control" autoFocus
            placeholder={ _t.translate('Search') } onChange={this.props.onChange} />
        </div>
      </form>
    )
  }
}

export default SearchField
