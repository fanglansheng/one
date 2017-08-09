import React from "react";
import PropTypes from "prop-types";

import { Carousel } from "react-bootstrap";

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
        const imgURL = photo.getUrl({ maxWidth: 380 });
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
        {/* <div className="place-header">
            //style={{ backgroundImage: `url(${imgURL})` }}
            {this.renderPhotos()}
          </div> */}
        <Carousel
          indicators={false}
          activeIndex={index}
          direction={direction}
          obSelect={this.handleSelectPhoto}
        >
          {this.renderPhotos()}
        </Carousel>

        <div className="place-detail">
          <h4>
            {place.name} <i className="fa fa-star" /> {place.rating}
          </h4>
          <p>
            <i className="fa fa-map-marker" /> {place.formatted_address}
          </p>
          <p>
            {/* website */}
            <i className="fa fa-map-marker" /> {place.formatted_address}
          </p>
          <p>
            {/* open hour if exit.*/}
            <i className="fa fa-clock" /> {place.formatted_address}
          </p>

          <a href={place.url}>Open in GoogleMap</a>
        </div>

        {/* place type */}
        <button onClick={handleAddPlace}>Add to trip</button>
      </div>
    );
  }
}
