import React from "react";
import PropTypes from "prop-types";
import { Marker, InfoWindow } from "react-google-maps";

import PlaceInfo from "./PlaceInfo";

export default class MapMarker extends React.Component {
  static propTypes = {
    icon: PropTypes.any,
    label: PropTypes.string,
    inTrip: PropTypes.bool,
    // the selected place
    place: PropTypes.object,
    addPlace: PropTypes.func
  };

  constructor(props) {
    super(props);

    this.state = {
      showInfo: false
    };
  }

  handleShowInfo = () => {
    this.setState({ showInfo: true });
  };

  handleHideInfo = () => {
    this.setState({ showInfo: false });
  };

  handleAddPlace = () => {
    this.props.addPlace();
    this.handleHideInfo();
  };

  render() {
    const { showInfo } = this.state;
    const { place, icon, label, inTrip } = this.props;

    const image = {
      url: icon,
      size: new google.maps.Size(20, 20),
      origin: new google.maps.Point(0, 0),
      scaledSize: new google.maps.Size(20, 20),
      // The anchor for this image is the base of the flagpole at (0, 32).
      anchor: new google.maps.Point(10, 5),
      labelOrigin: new google.maps.Point(10, -8)
    };
    return (
      <Marker
        defaultAnimation={2}
        icon={image}
        label={label}
        position={place.geometry.location}
        onClick={this.handleShowInfo}
      >
        {showInfo &&
          <InfoWindow onCloseClick={this.handleHideInfo}>
            <PlaceInfo
              inTrip={inTrip}
              place={place}
              handleAddPlace={this.handleAddPlace}
            />
          </InfoWindow>}
      </Marker>
    );
  }
}
