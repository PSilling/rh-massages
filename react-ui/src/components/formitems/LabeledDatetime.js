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
  state = { focused: false, stringValue: null, tooltipActive: false };

  tooltipTarget = Util.getTooltipTargets(1)[0];

  componentDidMount() {
    this.setState({ focused: false });
  }

  onFocus = () => {
    this.datetimeInput.select();
    this.setState({ focused: true });
  };

  /**
   * Mark datetime input as unfocused and use the invalid string value to correct the datetime value.
   */
  onBlur = () => {
    if (this.state.stringValue !== null && !this.props.dateFormat && this.props.timeFormat === "H:mm") {
      let stringTimeValue = this.state.stringValue.replace(/[^0-9:]/g, "");
      const semicolonIndex = stringTimeValue.indexOf(":");
      let hourPart;
      let minutePart;

      if (semicolonIndex === -1) {
        if (stringTimeValue.length < 4) {
          stringTimeValue = "0".repeat(4 - stringTimeValue.length) + stringTimeValue;
        }
        hourPart = stringTimeValue.slice(0, 2);
        minutePart = stringTimeValue.slice(2, 4);
      } else {
        hourPart = `00${stringTimeValue}`.substr(0, semicolonIndex + 2).slice(-2);
        minutePart = `${stringTimeValue}00`.substr(semicolonIndex + 1, 2);
      }

      this.props.onChange(
        moment(
          `${parseInt(hourPart, 10) > 23 ? "23" : hourPart}:${parseInt(minutePart, 10) > 59 ? "59" : minutePart}`,
          "H:mm"
        )
      );
      this.setState({ stringValue: null, focused: false });
    } else {
      this.setState({ focused: false });
    }
  };

  handleChange = value => {
    if (typeof value === "string") {
      this.setState({ stringValue: value });
    } else {
      this.setState({ stringValue: null });
      this.props.onChange(value);
    }
  };

  /**
   * Returns a placeholder generated from date and time format data
   */
  getPlaceholder = () => {
    let datePart = `${this.props.dateFormat} `;
    let timePart = this.props.timeFormat;

    if (this.props.dateFormat === undefined) {
      datePart = `${moment.localeData().longDateFormat("L")} `;
    } else if (!this.props.dateFormat) {
      datePart = "";
    }

    if (this.props.timeFormat === undefined) {
      timePart = moment.localeData().longDateFormat("LT");
    } else if (!this.props.timeFormat) {
      timePart = "";
    }

    return datePart + timePart;
  };

  toggleTooltip = () => {
    this.setState(prevState => ({ tooltipActive: !prevState.tooltipActive }));
  };

  handleKeyPress = event => {
    if (event.key === "Enter") {
      this.props.onEnterPress();
    }
  };

  handleKeyDown = event => {
    if (event.key === "ArrowUp" || event.key === "ArrowDown") {
      event.preventDefault();
      const changeType = this.props.dateFormat !== undefined && !this.props.dateFormat ? "minutes" : "days";

      if (event.key === "ArrowUp") {
        this.props.onChange(this.props.value.clone().add(1, changeType));
      } else {
        this.props.onChange(this.props.value.clone().subtract(1, changeType));
      }
    }
  };

  render() {
    const {
      onChange,
      label,
      value,
      dateFormat,
      timeFormat,
      disabled,
      labelWidth,
      onEnterPress,
      size,
      tooltip,
      validate,
      ...rest
    } = this.props;

    return (
      <Col md={this.props.size}>
        <FormGroup className={this.state.focused || this.state.stringValue === null ? "" : "was-validated"}>
          <Label id={this.tooltipTarget} for={`${this.tooltipTarget}_input`} style={{ width: this.props.labelWidth }}>
            {this.props.label}
          </Label>
          <Datetime
            {...rest}
            ref={datetime => {
              this.datetime = datetime;
            }}
            value={this.props.value}
            onFocus={this.onFocus}
            onBlur={this.onBlur}
            onChange={this.handleChange}
            dateFormat={this.props.dateFormat}
            timeFormat={this.props.timeFormat}
            inputProps={{
              id: `${this.tooltipTarget}_input`,
              disabled,
              autoComplete: "off",
              placeholder: this.getPlaceholder(),
              onKeyPress: this.handleKeyPress,
              onKeyDown: this.handleKeyDown,
              required: true,
              pattern: "1NVAL1D",
              ref: input => {
                this.datetimeInput = input;
              }
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
  label: PropTypes.node.isRequired,
  /** current value of the input field */
  value: PropTypes.oneOfType([PropTypes.instanceOf(moment), PropTypes.instanceOf(Date)]).isRequired,
  /** whether the Datetime should be disabled */
  disabled: PropTypes.bool,
  /** width of the label container */
  labelWidth: PropTypes.string,
  /** input datalist options */
  onEnterPress: PropTypes.func,
  /** input column length */
  size: PropTypes.string,
  /** input label tooltip */
  tooltip: PropTypes.string,
  /** whether the datetime value should be marked as invalid if incorrect */
  validate: PropTypes.bool
};

LabeledDatetime.defaultProps = {
  disabled: false,
  labelWidth: "auto",
  onEnterPress() {},
  size: "12",
  tooltip: "",
  validate: true
};

export default LabeledDatetime;
