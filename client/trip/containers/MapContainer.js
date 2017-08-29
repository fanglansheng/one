import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";

// components
import GoogleMapInstance from "../components/GoogleMapInstance";

// functions
import { fetchCreateActivity } from "../tripActions";

import {
  makeGetTrip,
  makeGetClassifiedActivities,
  getAllDirections
} from "../selector.js";

// set default location
const defaultCenter = {
  lat: +window.localStorage.getItem("lat") || 39.9375346,
  lng: +window.localStorage.getItem("lng") || 115.837023
};

const PlanBoxWidth = 380;
const MapWdith = window.innerWidth - PlanBoxWidth;

const compareArray = (a, b) => {
  if (a.length !== b.length) return false;
  for (let i = 0; i < a.length; i++) {
    if (a[i].place_id !== b[i].place_id) {
      return false;
    }
  }
  return true;
};

class TripMap extends React.Component {
  static propTypes = {
    directions: PropTypes.array,
    activities: PropTypes.array
  };

  constructor(props) {
    super(props);
    this.state = {
      zoom: 8,
      center: defaultCenter,
      // hold search place result
      resultPlaces: [],
      // the search area bound of search box
      bounds: new google.maps.LatLngBounds()
    };
  }

  componentDidMount() {
    this.initialMapCenter();
    this.setActivitiesCenter(this.props.activities);
  }

  // update map center when activity has change.
  componentWillReceiveProps(nextProps) {
    const { activities } = nextProps;
    if (!compareArray(activities, this.props.activities)) {
      this.setActivitiesCenter(activities);
    }
  }

  initialMapCenter = () => {
    // check current location in local storage
    const lat = window.localStorage.getItem("lat");
    const lng = window.localStorage.getItem("lng");
    // get current location if not in local storage
    if (!lat || (!lat && navigator.geolocation)) {
      if (!navigator.geolocation) {
        console.error("Error: Your browser doesn't support geolocation.");
        return;
      }

      const handleSuccess = position => {
        this.setState({
          center: {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          }
        });

        try {
          window.localStorage.setItem("lat", position.coords.latitude);
          window.localStorage.setItem("lng", position.coords.longitude);
        } catch (error) {
          // ignore the error
          console.log("ignore the error");
        }
      };

      const handleError = () => {
        console.error("The Geolocation service failed.");
      };

      navigator.geolocation.getCurrentPosition(handleSuccess, handleError);
    }
  };

  setActivitiesCenter = activities => {
    if (activities.length === 0) return null;

    let bounds = new google.maps.LatLngBounds();

    activities.forEach(act => {
      // Only geocodes have viewport.
      const position = act.place.geometry.location;
      const location = new google.maps.LatLng(position.lat, position.lng);
      bounds.extend(location);
    });

    this.setState({
      center: bounds.getCenter().toJSON(),
      zoom: 8
    });
  };

  // save the map object
  handleMapLoad = map => {
    this._mapComponent = map;
    if (map) {
      console.log("Map loaded");
    }
  };

  // save the searchbox object
  handleSearchBoxLoad = searchbox => {
    this._searchBoxComponent = searchbox;
    if (searchbox) {
      console.log(searchbox);
    }
  };

  handleMapClick = event => {
    // const nextMarkers = [
    //   ...this.state.markers,
    //   {
    //     position: event.latLng,
    //     defaultAnimation: 2,
    //     key: Date.now()
    //   },
    // ];
    // this.setState({
    //   markers: nextMarkers,
    // });
    // if (nextMarkers.length === 3) {
    //   this.props.toast(
    //     `Right click on the marker to remove it`,
    //     `Also check the code!`
    //   );
    // }
  };

  handlePlaceChanged = () => {
    const resultPlaces = this._searchBoxComponent.getPlaces();
    if (resultPlaces.length == 0) return;

    // Clear old markers
    this.setState({ resultPlaces: [] });

    // For each place, get the icon, name and location.
    let bounds = new google.maps.LatLngBounds();

    resultPlaces.forEach(place => {
      if (!place.geometry) {
        console.log("Returned place contains no geometry");
        return;
      }

      if (place.geometry.viewport) {
        // Only geocodes have viewport.
        bounds.union(place.geometry.viewport);
      } else {
        bounds.extend(place.geometry.location);
      }
    });

    this.setState({ resultPlaces, zoom: 14 });
    this._mapComponent.fitBounds(bounds);
  };

  // Bias the SearchBox results towards current map's viewport.
  // Search in current area
  handleBoundChanged = () => {
    const bounds = this._mapComponent.getBounds();
    this.setState({ bounds });
  };

  handleAddPlace = placeId => {
    this.props.dispatch(fetchCreateActivity(this.props.tripId, placeId));
  };

  render() {
    const style = { height: `100%`, width: `${MapWdith}px` };
    return (
      <GoogleMapInstance
        containerElement={<div className="full-height" />}
        mapElement={<div style={style} />}
        zoom={this.state.zoom}
        center={this.state.center}
        bounds={this.state.bounds}
        directions={this.props.directions}
        resultPlaces={this.state.resultPlaces}
        activities={this.props.activities}
        onMapLoad={this.handleMapLoad}
        onSearchBoxLoad={this.handleSearchBoxLoad}
        onMapClick={this.handleMapClick}
        onAddPlace={this.handleAddPlace}
        // set search place result
        onPlacesChanged={this.handlePlaceChanged}
        // bind google map bound to search range
        onSetBounds={this.handleBoundChanged}
      />
    );
  }
}

const mapStateToProps = (state, props) => {
  // this is current trip id.
  const { tripId } = props;
  const { isFetching } = state.trips;

  // get activities
  const getTrip = makeGetTrip(tripId);
  const currentTrip = getTrip(state);
  const { activities } = currentTrip;

  const directions = getAllDirections(state);

  return {
    isFetching,
    tripId,
    directions,
    activities
  };
};

export default connect(mapStateToProps)(TripMap);
