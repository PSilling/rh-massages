// react imports
import React, { Component } from "react";
import PropTypes from "prop-types";

// module imports
import { Col, FormGroup, Label, Input, Tooltip } from "reactstrap";

// util imports
import Util from "../../util/Util";

/**
 * A combined formgroup component with a label (can have a tooltip) and an input.
 * A column is included to set input size.
 */
class LabeledInput extends Component {
  state = { tooltipActive: false };

  tooltipTarget = Util.getTooltipTargets(1)[0];

  toggleTooltip = () => {
    this.setState(prevState => ({ tooltipActive: !prevState.tooltipActive }));
  };

  handleKeyPress = event => {
    if (event.key === "Enter") {
      this.props.onEnterPress();
    }
  };

  render() {
    const { onChange, label, value, onEnterPress, options, size, tooltip, ...rest } = this.props;
    return (
      <Col md={this.props.size}>
        <FormGroup>
          <Label id={this.tooltipTarget} for={`${this.tooltipTarget}_input`}>
            {this.props.label}
          </Label>
          <Input
            {...rest}
            id={`${this.tooltipTarget}_input`}
            value={this.props.value}
            onChange={this.props.onChange}
            onKeyPress={this.handleKeyPress}
            placeholder={this.props.label}
            list={`${this.tooltipTargets}_list`}
          />
          {this.props.options.length > 0 && (
            <datalist id={`${this.tooltipTargets}_list`}>
              {this.props.options.map(item => (
                <option key={item} value={item} />
              ))}
            </datalist>
          )}
          {this.props.tooltip !== "" && (
            <Tooltip isOpen={this.state.tooltipActive} target={this.tooltipTarget} toggle={this.toggleTooltip}>
              {this.props.tooltip}
            </Tooltip>
          )}
        </FormGroup>
      </Col>
    );
  }
}

LabeledInput.propTypes = {
  /** function called on input value change */
  onChange: PropTypes.func.isRequired,
  /** input label text */
  label: PropTypes.string.isRequired,
  /** current value of the input field */
  value: PropTypes.string.isRequired,
  /** input datalist options */
  onEnterPress: PropTypes.func,
  /** input datalist options */
  options: PropTypes.arrayOf(PropTypes.string),
  /** input column length */
  size: PropTypes.string,
  /** input label tooltip */
  tooltip: PropTypes.string
};

LabeledInput.defaultProps = {
  onEnterPress() {},
  options: [],
  size: "12",
  tooltip: ""
};

export default LabeledInput;
