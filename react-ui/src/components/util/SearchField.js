// react imports
import React, { Component } from 'react';
import PropTypes from 'prop-types';

// util imports
import Util from '../../util/Util';
import _t from '../../util/Translations';

/**
 * Custom search input component.
 */
class SearchField extends Component {

  render() {
    return (
      <div className="input-group" style={{ 'marginBottom': '15px' }}>
        <span className="input-group-addon"><span className="glyphicon glyphicon-search"></span></span>
        <input type="search" value={this.props.value} className="form-control"
          placeholder={ _t.translate('Search') } onChange={this.props.onChange}
          autoFocus onFocus={Util.moveCursorToEnd}
        />
      </div>
    );
  }
}

SearchField.propTypes = {
  value: PropTypes.string, // current value of the search input
  onChange: PropTypes.func // function called on value change
};

export default SearchField
