import {
  default as React,
  Component,
  PropTypes
} from 'react';

import {
  withGoogleMap,
  GoogleMap,
  Marker,
} from "react-google-maps";


import SearchBox from 'react-google-maps/lib/places/SearchBox';

const ContainerBox = (<div className="map-container" />);
const MapBox = (<div style={{ height: `100%` }} />);


const TripMap = withGoogleMap(props => (
  <GoogleMap
    ref={props.onMapLoad}
    defaultZoom={8}
    defaultCenter={{ lat: 25.0112183, lng: 121.5206757 }}
    onClick={props.onMapClick}
    onBoundsChanged={props.onSetBounds}
  >
    <SearchBox
      inputClassName='searchbox-input'
      ref={props.onSearchBoxLoad}
      bounds={props.bounds}
      inputPlaceholder="Customized your placeholder"
      controlPosition={google.maps.ControlPosition.TOP_RIGHT}
      onPlacesChanged={props.onPlacesChanged}
    />
    {props.places.map( (place, key) => (
      <Marker
        defaultAnimation={2}
        position={place.geometry.location}
        key={place.place_id}
        onClick={() => props.onClickMarker(place)}
        onRightClick={() => props.onMarkerRightClick(place)}
      />
    ))}
  </GoogleMap>
));

export default class TripMapBox extends Component {
  static propTypes = {
    currentItineraryId : PropTypes.number.isRequired,
    selectMarker: PropTypes.func.isRequired,
    addActivity: PropTypes.func.isRequired
  }

  constructor(props){
    super(props);
    this.state = {
      places: [],
      bounds: new google.maps.LatLngBounds()
    };
  }

  // save the map object
  handleMapLoad = (map) => {
    this._mapComponent = map;
    if (map) {
      console.log(map.getZoom());
    }
  }

  handleMapClick = (event) => {
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
  }

  handleMarkerRightClick = (targetMarker) => {
    /*
     * All you modify is data, and the view is driven by data.
     * This is so called data-driven-development. (And yes, it's now in
     * web front end and even with google maps API.)
     */
    const nextMarkers = this.state.markers.filter(marker => marker !== targetMarker);
    this.setState({
      markers: nextMarkers,
    });
  }

  // save the searchbox object
  handleSearchBoxLoad = (searchbox) => {
    this._searchBoxComponent = searchbox;
    if(searchbox) {
      console.log(searchbox);
    }
  }

  handlePlaceChanged = () => {
    const searchedPlaces = this._searchBoxComponent.getPlaces();
    if (searchedPlaces.length == 0) return;

    // Clear old markers
    this.setState({ places: [] });

    // For each place, get the icon, name and location.
    let places = [];
    let bounds = new google.maps.LatLngBounds();
    searchedPlaces.forEach((place) => {

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

      // Create a marker for each place.
      places.push(place);

    });

    if(places.length == 1){
      const {currentItineraryId, addActivity} = this.props;
      const place = places[0];

      addActivity(currentItineraryId, {
        place_id: place.place_id,
        name: place.name,
        address: place.formatted_address
      });
    }

    this.setState({places});
    this._mapComponent.fitBounds(bounds);
  }

  // Bias the SearchBox results towards current map's viewport.
  handleBoundChanged = () => {
    const bounds = this._mapComponent.getBounds();
    this.setState({ bounds });
  }

  handleClickMarker = (place) => {
    console.log(place.place_id);
    this.props.selectMarker(place);
  }

  render() {
    return (
      <TripMap
        containerElement={ContainerBox}
        mapElement={MapBox}
        onMapLoad={this.handleMapLoad}
        onMapClick={this.handleMapClick}
        places={this.state.places}
        onMarkerRightClick={this.handleMarkerRightClick}
        onSearchBoxLoad={this.handleSearchBoxLoad}
        onPlacesChanged={this.handlePlaceChanged}
        onSetBounds={this.handleBoundChanged}
        bounds={this.state.bounds}

        onClickMarker={this.handleClickMarker}
      />
    );
  }
}