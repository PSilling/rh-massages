// react imports
import React, { Component } from "react";
import PropTypes from "prop-types";

// module imports
import { Row, Col, Card, Button, CardHeader, CardBody, CardText } from "reactstrap";
import moment from "moment";

// component imports
import CalendarButton from "../iconbuttons/CalendarButton";
import ConfirmationModal from "../modals/ConfirmationModal";

// util imports
import Util from "../../util/Util";
import _t from "../../util/Translations";

/**
 * Massage information panel for My Massages view.
 */
class MyMassagePanel extends Component {
  state = { active: false };

  shouldComponentUpdate(nextProps, nextState) {
    return (
      this.props.type !== nextProps.type ||
      this.props.massage.masseuse !== nextProps.massage.masseuse ||
      this.props.massage.date !== nextProps.massage.date ||
      this.props.massage.ending !== nextProps.massage.ending ||
      this.state.active !== nextState.active
    );
  }

  handleToggle = () => {
    this.setState(prevStata => ({ active: !prevStata.active }));
  };

  cancelMassage = () => {
    Util.put(
      Util.MASSAGES_URL,
      [
        {
          id: this.props.massage.id,
          date: this.props.massage.date,
          ending: this.props.massage.ending,
          masseuse: this.props.massage.masseuse,
          client: null,
          facility: this.props.massage.facility
        }
      ],
      this.props.getCallback
    );
  };

  render() {
    return (
      <div className="mb-3">
        <Row>
          <Col md="3">
            <Card color={this.props.type} outline>
              <CardHeader>
                {moment(this.props.massage.date).format("ddd L")}
                <Button
                  color="light"
                  className="close"
                  aria-label="Close"
                  onClick={this.handleToggle}
                  disabled={this.props.disabled}
                >
                  {!this.props.disabled && <span aria-hidden="true">&times;</span>}
                </Button>
              </CardHeader>
              <CardBody>
                <CardText>{`${_t.translate("Facility")}: ${this.props.massage.facility.name}`}</CardText>
                <CardText>{`${_t.translate("Masseur/Masseuse")}: ${this.props.massage.masseuse}`}</CardText>
                <CardText>
                  {`${_t.translate("Time")}: ${moment(this.props.massage.date).format("HH:mm")}–${moment(
                    this.props.massage.ending
                  ).format("HH:mm")}`}
                </CardText>
                <CardText>
                  {`${_t.translate("Event")}: `}
                  <CalendarButton link={Util.getEventLink(this.props.massage)} />
                </CardText>
              </CardBody>
            </Card>
          </Col>
        </Row>
        {this.state.active && (
          <ConfirmationModal
            message={_t.translate("Are you sure you want to unassign yourself from this massage?")}
            onClose={this.handleToggle}
            onConfirm={() => {
              this.handleToggle();
              this.cancelMassage();
            }}
          />
        )}
      </div>
    );
  }
}

MyMassagePanel.propTypes = {
  /** Massage to be printed inside the panel */
  massage: PropTypes.shape({
    id: PropTypes.number,
    masseuse: PropTypes.string,
    date: PropTypes.oneOfType([PropTypes.number, PropTypes.instanceOf(Date)]),
    ending: PropTypes.oneOfType([PropTypes.number, PropTypes.instanceOf(Date)]),
    client: PropTypes.shape({
      email: PropTypes.string,
      name: PropTypes.string,
      surname: PropTypes.string,
      sub: PropTypes.string,
      subscribed: PropTypes.bool
    }),
    facility: PropTypes.shape({
      id: PropTypes.number,
      name: PropTypes.string
    })
  }).isRequired,
  /** type of the Bootstrap panel */
  type: PropTypes.string,
  /** whether the removal button should be hidden or not */
  disabled: PropTypes.bool,
  /** update callback function called on Massage cancellation */
  getCallback: PropTypes.func
};

MyMassagePanel.defaultProps = {
  type: "default",
  disabled: true,
  getCallback: null
};

export default MyMassagePanel;
