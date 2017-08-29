/**
 *
 */
import React from "react";
import PropTypes from "prop-types";

import {
  ButtonToolbar,
  ToggleButtonGroup,
  ToggleButton
} from "react-bootstrap";

// import style
import "./RouteButtonStyle.scss";

const travelModes = [
  { value: google.maps.TravelMode.BICYCLING, icon: "directions_bike" },
  { value: google.maps.TravelMode.DRIVING, icon: "directions_car" },
  { value: google.maps.TravelMode.TRANSIT, icon: "directions_bus" },
  { value: google.maps.TravelMode.WALKING, icon: "directions_walk" }
];

export default class RouteButton extends React.Component {
  static propTypes = {
    onCalculateDirection: PropTypes.func.isRequired,
    onClearDirection: PropTypes.func.isRequired
  };

  constructor(props) {
    super(props);
    this.state = {
      value: [],
      selected: false
    };
  }

  handleChange = val => {
    this.setState({ selected: true });
    this.props.onCalculateDirection(val);
  };

  handleClear = () => {
    this.setState({ selected: false, value: [] });
    this.props.onClearDirection();
  };

  render() {
    const { selected, value } = this.state;
    return (
      <div className="btn-route">
        <span>Directions</span>
        <ToggleButtonGroup
          name="toggleButtonGroup"
          type="radio"
          value={value}
          onChange={this.handleChange}
        >
          {travelModes.map((option, i) =>
            <ToggleButton className="btn-toggle" key={i} value={option.value}>
              <i className="material-icons">
                {option.icon}
              </i>
            </ToggleButton>
          )}
        </ToggleButtonGroup>
        {selected && <button onClick={this.handleClear}>clear</button>}
      </div>
    );
  }
}
