import React from "react";
import PropTypes from "prop-types";

// components
import { Carousel, DropdownButton, MenuItem } from "react-bootstrap";
import core from "../../core";
const { OpenHourTable, VisitTypeButton, constants } = core;

import "./PlaceInfoStyle.scss";

export default class PlaceInfo extends React.Component {
  static propTypes = {
    // the selected place
    place: PropTypes.object,
    handleAddPlace: PropTypes.func
  };

  constructor(props) {
    super(props);

    this.state = {
      index: 0,
      direction: null,
      visitType: constants.VisitType.ACTIVITY.value
    };
  }

  handleSelectType = val => {
    this.setState({ visitType: val });
  };

  handleSelectPhoto = (selectedIndex, e) => {
    this.setState({
      index: selectedIndex,
      direction: e.direction
    });
  };

  renderPhotos() {
    const { place } = this.props;
    const { index, direction } = this.state;
    const photos = place.photos.filter(p => p.getUrl !== undefined);

    if (!photos.length) return null;
    return (
      <Carousel
        indicators={false}
        activeIndex={index}
        direction={direction}
        onSelect={this.handleSelectPhoto}
      >
        {photos.map((photo, keyIndex) => {
          const imgURL = photo.getUrl({ maxWidth: 360 });
          return (
            <Carousel.Item key={keyIndex}>
              <img src={imgURL} />
            </Carousel.Item>
          );
        })}
      </Carousel>
    );
  }

  renderRating() {
    const { rating } = this.props.place;
    if (!rating) return null;

    const ratingNumber = parseFloat(rating);
    let stars = [];

    for (let i = 0; i < 5; i++) {
      const diff = ratingNumber - i;
      let starType;
      if (diff >= 1) {
        starType = "star";
      } else if (diff < 0) {
        starType = "star_border";
      } else {
        starType = "star_half";
      }
      stars.push(
        <i key={i} className="material-icons">
          {starType}
        </i>
      );
    }

    return (
      <span className="rating">
        <span className="rating-text">
          {rating}
        </span>
        <span className="rating-star">
          {stars}
        </span>
      </span>
    );
  }

  render() {
    const { place, handleAddPlace } = this.props;
    const { visitType } = this.state;

    return (
      <div className="info-box">
        <div className="info-box-title">
          <h5>
            {place.name}
          </h5>
          <p>
            {this.renderRating()}
            <a href={place.url}>Open in GoogleMap</a>
          </p>
        </div>

        <div className="info-box-content">
          {place.formatted_address &&
            <p>
              <i className="material-icons">place</i>
              {place.formatted_address}
            </p>}

          {place.website &&
            <p>
              <i className="material-icons">public</i>
              <a href={place.website}>
                {place.website}
              </a>
            </p>}

          {place.international_phone_number &&
            <p>
              <i className="material-icons">phone</i>
              {place.international_phone_number}
            </p>}

          {place.opening_hours &&
            <OpenHourTable
              openNow={place.opening_hours.open_now}
              weekdayText={place.opening_hours.weekday_text}
            />}

          {/* place type <VisitTypeButton
            id="place-visit-type"
            value={visitType}
            handleSelect={this.handleSelectType}
          />*/}

          {handleAddPlace &&
            <button onClick={handleAddPlace}>+ Add to trip</button>}
        </div>
        {this.renderPhotos()}
      </div>
    );
  }
}
