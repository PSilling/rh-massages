// react imports
import React, { Component } from "react";
import PropTypes from "prop-types";

// module imports
import { Tooltip } from "reactstrap";

/**
 * A single group of multiple reactstrap tooltips.
 */
class TooltipGroup extends Component {
  state = { activeTooltip: -1 };

  changeActiveTooltip = id => {
    if (this.state.activeTooltip !== id) {
      this.setState({ activeTooltip: id });
    } else {
      this.setState({ activeTooltip: -1 });
    }
  };

  createTooltips = () => {
    const tooltips = [];
    const minLength =
      this.props.labels.length > this.props.targets.length ? this.props.targets.length : this.props.labels.length;

    for (let i = 0; i < minLength; i++) {
      tooltips.push(
        <Tooltip
          key={this.props.targets[i]}
          isOpen={this.state.activeTooltip === i}
          target={this.props.targets[i]}
          toggle={() => this.changeActiveTooltip(i)}
          trigger="hover"
        >
          {this.props.labels[i]}
        </Tooltip>
      );
    }

    return tooltips;
  };

  render() {
    return <div className="no-print">{this.createTooltips()}</div>;
  }
}

TooltipGroup.propTypes = {
  /** array of tooltips message labels */
  labels: PropTypes.arrayOf(PropTypes.string).isRequired,
  /** array of tooltip targets */
  targets: PropTypes.arrayOf(PropTypes.string).isRequired
};

export default TooltipGroup;
