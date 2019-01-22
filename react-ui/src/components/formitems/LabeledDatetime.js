// react imports
import React, { Component } from "react";
import PropTypes from "prop-types";

// module imports
import { Col, FormGroup, Label, Tooltip } from "reactstrap";
import Datetime from "react-datetime";
import moment from "moment";

// util imports
import Util from "../../util/Util";

/**
 * A combined formgroup component with a label (can have a tooltip) and a Datetime input.
 * A column is included to set input size.
 */
class LabeledDatetime extends Component {
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
    const { disabled, onChange, label, value, onEnterPress, size, tooltip, ...rest } = this.props;
    return (
      <Col md={this.props.size}>
        <FormGroup>
          <Label id={this.tooltipTarget} for={`${this.tooltipTarget}_input`}>
            {this.props.label}
          </Label>
          <Datetime
            {...rest}
            value={this.props.value}
            onChange={this.props.onChange}
            inputProps={{
              id: `${this.tooltipTarget}_input`,
              disabled,
              placeholder: this.props.label,
              onKeyPress: this.handleKeyPress
            }}
          />
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

LabeledDatetime.propTypes = {
  /** function called on input value change */
  onChange: PropTypes.func.isRequired,
  /** input label text */
  label: PropTypes.string.isRequired,
  /** current value of the input field */
  value: PropTypes.oneOfType([PropTypes.instanceOf(moment), PropTypes.instanceOf(Date)]).isRequired,
  /** whether the Datetime should be disabled */
  disabled: PropTypes.bool,
  /** input datalist options */
  onEnterPress: PropTypes.func,
  /** input column length */
  size: PropTypes.string,
  /** input label tooltip */
  tooltip: PropTypes.string
};

LabeledDatetime.defaultProps = {
  onEnterPress() {},
  disabled: false,
  size: "12",
  tooltip: ""
};

export default LabeledDatetime;
