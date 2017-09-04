import React from "react";
import PropTypes from "prop-types";
import { Marker, InfoWindow } from "react-google-maps";

import PlaceInfo from "./PlaceInfo";
const IconSize = 18;

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

    const image = icon
      ? {
          url: icon,
          size: new google.maps.Size(IconSize, IconSize),
          origin: new google.maps.Point(0, 0),
          scaledSize: new google.maps.Size(IconSize, IconSize),
          // The anchor for this image is position
          anchor: new google.maps.Point(IconSize / 2, IconSize / 2),
          labelOrigin: new google.maps.Point(IconSize / 2, -8)
        }
      : null;

    return (
      <Marker
        defaultAnimation={2}
        icon={image}
        label={label}
        position={place.geometry.location}
        onClick={this.handleShowInfo}
      >
        {showInfo && (
          <InfoWindow onCloseClick={this.handleHideInfo}>
            <PlaceInfo
              inTrip={inTrip}
              place={place}
              handleAddPlace={this.handleAddPlace}
            />
          </InfoWindow>
        )}
      </Marker>
    );
  }
}
