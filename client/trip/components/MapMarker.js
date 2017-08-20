import React from "react";
import PropTypes from "prop-types";
import { Marker, InfoWindow } from "react-google-maps";

import PlaceInfo from "./PlaceInfo";

export default class MapMarker extends React.Component {
  static propTypes = {
    icon: PropTypes.any,
    label: PropTypes.string,
    // the selected place
    place: PropTypes.object,
    handleAddPlace: PropTypes.func
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

  render() {
    const { showInfo } = this.state;
    const { place, handleAddPlace, icon, label } = this.props;
    return (
      <Marker
        defaultAnimation={2}
        icon={icon}
        label={label}
        position={place.geometry.location}
        onClick={this.handleShowInfo}
      >
        {showInfo &&
          <InfoWindow onCloseClick={this.handleHideInfo}>
            <PlaceInfo place={place} handleAddPlace={handleAddPlace} />
          </InfoWindow>}
      </Marker>
    );
  }
}
