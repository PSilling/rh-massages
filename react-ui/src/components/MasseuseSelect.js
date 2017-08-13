// react imports
import React, { Component } from 'react';

// module imports
import Select from 'react-select';
import 'react-select/dist/react-select.css';

// util imports
import Util from '../utils/Util.js';

  /**
   * Custom dropdown component for selection of a masseuse.
   */
 class MasseuseSelect extends Component {

  state = {options: [{value: this.props.value, label: 'N/A'}]}

  componentDidMount() {
    this.getOptions();
  }

  getOptions() {
    Util.get("/api/users/getMasseuses", (json) => {
      var data = [];
      for (let i in json) {
        if (!json[i].isAdmin) continue;
        data.push({
          value: json[i].id,
          label: json[i].name
        });
      }
      this.setState({options: data});
      this.props.onChange(data[0].id);
    });
  }

   render () {
     return (
        <Select
          value={this.props.value}
          options={this.state.options}
          clearable={false}
          onChange={(option) => this.props.onChange(option.value)}
        />
     );
   }
 }

export default MasseuseSelect
