// react imports
import React, { Component } from 'react';
import PropTypes from 'prop-types';

// util imports
import _t from '../../util/Translations';

/**
 * Simple title message shown to unauthorized users.
 */
class UnauthorizedMessage extends Component {

  render() {
    return (
      <div>
        <h1>
          { this.props.title }
        </h1>
        <hr />
        <h2>
          { _t.translate('Unauthorized') }
        </h2>
      </div>
    );
  }
}

UnauthorizedMessage.propTypes = {
  /** title shown above unauthorized notification */
  title: PropTypes.string
};

export default UnauthorizedMessage
