import React from "react";
import PropTypes from "prop-types";
import { Marker, InfoWindow } from "react-google-maps";

import PlaceInfo from "./PlaceInfo";

export default class MapMarker extends React.Component {
  static propTypes = {
    // the selected place
    place: PropTypes.object,
    handleClick: PropTypes.func.isRequired
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
    const { place } = this.props;
    return (
      <Marker
        defaultAnimation={2}
        position={place.geometry.location}
        onClick={this.handleShowInfo}
      >
        {showInfo &&
          <InfoWindow onCloseClick={this.handleHideInfo}>
            <PlaceInfo place={place} handleAddPlace={() => {}} />
          </InfoWindow>}
      </Marker>
    );
  }
}
