import React from "react";
import PropTypes from "prop-types";

import {
  ButtonToolbar,
  ToggleButtonGroup,
  ToggleButton
} from "react-bootstrap";

const { BICYCLING, DRIVING, TRANSIT, WALKING } = google.maps.TravelMode;

export default class DirectionToolbar extends React.Component {
  static propTypes = {
    handleCalculateRoute: PropTypes.func.isRequired
  };

  constructor(props) {
    super(props);
    this.state = {
      travelMode: "DRIVING"
    };
  }

  handleSetTravelMode = val => {
    this.setState({ travelMode: val });
  };

  handleClickCalculate = () => {
    const { travelMode } = this.state;
    this.props.handleCalculateRoute(travelMode);
  };

  render() {
    const { travelMode } = this.state;
    return (
      <ButtonToolbar>
        <ToggleButtonGroup
          type="radio"
          name="travelMode"
          defaultValue="DRIVING"
          onChange={this.handleSetTravelMode}
        >
          <ToggleButton value={BICYCLING}>
            <i className="fa fa-bicycle" />
          </ToggleButton>
          <ToggleButton value={DRIVING}>
            <i className="fa fa-car" />
          </ToggleButton>
          <ToggleButton value={TRANSIT}>
            <i className="fa fa-bus" />
          </ToggleButton>
          <ToggleButton value={WALKING}>WALKING</ToggleButton>
        </ToggleButtonGroup>
        <button onClick={this.handleClickCalculate}>show route</button>
      </ButtonToolbar>
    );
  }
}
