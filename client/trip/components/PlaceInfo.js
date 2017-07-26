import { default as React, Component, PropTypes } from "react";

export default class PlaceInfo extends Component {
  static propTypes = {
    place: PropTypes.any.isRequired,
    handleAddPlace: PropTypes.func.isRequired
  };

  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const { place, handleAddPlace } = this.props;
    if (!place.name) return null;

    const imgURL = place.photos[0].getUrl({ maxWidth: 380 });
    return (
      <div className="info-box">
        <div
          className="place-header"
          style={{ backgroundImage: `url(${imgURL})` }}
        >
          <h4>
            {place.name} <i className="fa fa-star" /> {place.rating}
          </h4>
        </div>
        <div className="place-detail">
          <p>
            <i className="fa fa-map-marker" /> {place.formatted_address}
          </p>
          <a href={place.url}>Open in GoogleMap</a>
          <button onClick={handleAddPlace}>Add to trip</button>
        </div>
      </div>
    );
  }
}
