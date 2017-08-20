import React from "react";
import PropTypes from "prop-types";

// components
import GoogleMapInstance from "./GoogleMapInstance";

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

export default class TripMapBox extends React.Component {
  static propTypes = {
    activityPlaces: PropTypes.array,
    addActivity: PropTypes.func.isRequired
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
    this.setActivitiesCenter(this.props.activityPlaces);
  }

  componentWillReceiveProps(nextProps) {
    const { activityPlaces } = nextProps;
    if (!compareArray(activityPlaces, this.props.activityPlaces)) {
      this.setActivitiesCenter(activityPlaces);
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

  setActivitiesCenter = activityPlaces => {
    if (activityPlaces.length === 0) return null;

    let bounds = new google.maps.LatLngBounds();

    activityPlaces.forEach(place => {
      // Only geocodes have viewport.
      const position = place.geometry.location;
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

    this.setState({
      resultPlaces,
      zoom: 14
    });
    this._mapComponent.fitBounds(bounds);
  };

  // Bias the SearchBox results towards current map's viewport.
  // Search in current area
  handleBoundChanged = () => {
    const bounds = this._mapComponent.getBounds();
    this.setState({ bounds });
  };

  render() {
    const style = { height: `100%`, width: `${MapWdith}px` };
    return (
      <GoogleMapInstance
        containerElement={<div className="map-container" />}
        mapElement={<div style={style} />}
        zoom={this.state.zoom}
        center={this.state.center}
        bounds={this.state.bounds}
        directions={this.props.directions}
        resultPlaces={this.state.resultPlaces}
        activityPlaces={this.props.activityPlaces}
        onMapLoad={this.handleMapLoad}
        onSearchBoxLoad={this.handleSearchBoxLoad}
        onMapClick={this.handleMapClick}
        onAddPlace={this.props.addActivity}
        // set search place result
        onPlacesChanged={this.handlePlaceChanged}
        // bind google map bound to search range
        onSetBounds={this.handleBoundChanged}
      />
    );
  }
}

TripMapBox.defaultProps = {
  activityPlaces: []
};
