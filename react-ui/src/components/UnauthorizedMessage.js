// react imports
import React, { Component } from 'react';

// util imports
import _t from '../utils/Translations.js';

/**
 * Message shown to unauthorized users.
 */
class UnauthorizedMessage extends Component {

  render() {
    return(
      <div>
        <h1>
          { this.props.title }
        </h1>
        <hr />
          <h2>
            { _t.translate('Unauthorized') }
          </h2>
      </div>
    )
  }
}

export default UnauthorizedMessage
