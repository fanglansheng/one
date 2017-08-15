import React from "react";
import PropTypes from "prop-types";

// components
import { Carousel } from "react-bootstrap";
import core from "../../core";
const { OpenHourTable } = core;

import "./PlaceInfoStyle.scss";

const InfoEntry = ({ icon, info }) =>
  <p className="place-info-entry">
    <i className={icon} />
    {info}
  </p>;

export default class PlaceInfo extends React.Component {
  static propTypes = {
    // the selected place
    place: PropTypes.object,
    handleAddPlace: PropTypes.func.isRequired
  };

  constructor(props) {
    super(props);

    this.state = {
      index: 0,
      direction: null
    };
  }

  handleSelectPhoto = (selectedIndex, e) => {
    this.setState({
      index: selectedIndex,
      direction: e.direction
    });
  };

  renderPhotos() {
    const { place } = this.props;
    if (place.photos) {
      return place.photos.map((photo, keyIndex) => {
        const imgURL = photo.getUrl({ maxWidth: 360 });
        return (
          <Carousel.Item key={keyIndex}>
            <img src={imgURL} />
          </Carousel.Item>
        );
      });
    }
  }

  render() {
    const { place, handleAddPlace } = this.props;
    const { index, direction } = this.state;
    if (!place) return <div className="info-box">No place selected</div>;

    return (
      <div className="info-box">
        <Carousel
          indicators={false}
          activeIndex={index}
          direction={direction}
          onSelect={this.handleSelectPhoto}
        >
          {this.renderPhotos()}
        </Carousel>

        <div className="place-detail">
          <h4>
            {place.name}
          </h4>
          <InfoEntry icon="fa fa-star" info={`Rating: ${place.rating}`} />
          <InfoEntry icon="fa fa-map-marker" info={place.formatted_address} />

          {place.website &&
            <InfoEntry icon="fa fa-globe" info={place.website} />}

          {place.opening_hours &&
            <OpenHourTable
              openNow={place.opening_hours.open_now}
              weekdayText={place.opening_hours.weekday_text}
            />}

          <a href={place.url}>Open in GoogleMap</a>
        </div>

        {/* place type */}
        <button onClick={handleAddPlace}>Add to trip</button>
      </div>
    );
  }
}
