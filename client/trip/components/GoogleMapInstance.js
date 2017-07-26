import { default as React, PropTypes } from "react";

import {
  withGoogleMap,
  GoogleMap,
  Marker,
  DirectionsRenderer
} from "react-google-maps";

import SearchBox from "react-google-maps/lib/places/SearchBox";

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
      inputPlaceholder="Customized your placeholder"
      controlPosition={SearchBarPosition}
      onPlacesChanged={props.onPlacesChanged}
    />
    {props.resultPlaces.map((place, key) =>
      <Marker
        defaultAnimation={2}
        position={place.geometry.location}
        key={place.place_id}
        onClick={() => props.onClickMarker(place)}
        onRightClick={() => props.onMarkerRightClick(place)}
      />
    )}
    {props.activityPlaces.map((place, key) =>
      <Marker
        defaultAnimation={2}
        position={place.geometry.location}
        key={place.place_id}
        icon={StarIcon}
        label={(key + 1).toString()}
        onClick={() => props.onClickMarker(place)}
        onRightClick={() => props.onMarkerRightClick(place)}
      />
    )}
    {props.directions && <DirectionsRenderer directions={props.directions} />}
  </GoogleMap>
);
