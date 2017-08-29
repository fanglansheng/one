import React from "react";
import PropTypes from "prop-types";
import {
  withGoogleMap,
  GoogleMap,
  Marker,
  DirectionsRenderer
} from "react-google-maps";

import SearchBox from "react-google-maps/lib/places/SearchBox";
import MapMarker from "./MapMarker";

const SearchBarPosition = google.maps.ControlPosition.TOP_RIGHT;

const StarIcon = {
  path: "M 25,1 31,18 49,18 35,29 40,46 25,36 10,46 15,29 1,18 19,18 z",
  fillColor: "#fff100",
  fillOpacity: 1,
  scale: 0.3,
  strokeColor: "#e09f30",
  strokeWeight: 1
};

export default withGoogleMap(props =>
  <GoogleMap
    ref={props.onMapLoad}
    zoom={props.zoom}
    center={props.center}
    onClick={props.onMapClick}
    onBoundsChanged={props.onSetBounds}
  >
    <SearchBox
      inputClassName="searchbox-input"
      ref={props.onSearchBoxLoad}
      bounds={props.bounds}
      inputPlaceholder="Search where to go"
      controlPosition={SearchBarPosition}
      onPlacesChanged={props.onPlacesChanged}
    />
    {props.resultPlaces.map(place =>
      <MapMarker
        place={place}
        key={place.place_id}
        addPlace={() => props.onAddPlace(place.place_id)}
      />
    )}
    {props.activities.map((activity, index) =>
      <MapMarker
        // defaultAnimation={2}
        // position={place.geometry.location}
        inTrip
        place={activity.place}
        key={activity.place.place_id}
        icon={StarIcon} //{`/static/images/${activity.visitType}`}
        label={(index + 1).toString()}
        // onClick={() => {}}
      />
    )}
    {props.directions.map((d, key) =>
      <DirectionsRenderer key={key} directions={d} />
    )}
  </GoogleMap>
);
