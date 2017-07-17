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

const mapWdith = window.innerWidth - 380;

const ContainerBox = (<div className="map-container" />);
const MapBox = (
  <div style={{ height: `100%`, width: `${mapWdith}px`}} />
);

const SearchBarPosition = google.maps.ControlPosition.TOP_RIGHT;

const StarIcon = {
  // path: 'M 125,5 155,90 245,90 175,145 200,230 125,180 50,230 75,145 5,90 95,90 z',
  path: 'M 25,1 31,18 49,18 35,29 40,46 25,36 10,46 15,29 1,18 19,18 z',
  fillColor: '#fff100',
  fillOpacity: 1,
  scale: 0.3,
  strokeColor: '#e09f30',
  strokeWeight: 1
};

const TripMap = withGoogleMap(props => (
  <GoogleMap
    ref={props.onMapLoad}
    defaultZoom={5}
    defaultCenter={props.center}
    onClick={props.onMapClick}
    onBoundsChanged={props.onSetBounds}
  >
    <SearchBox
      inputClassName='searchbox-input'
      ref={props.onSearchBoxLoad}
      bounds={props.bounds}
      inputPlaceholder="Customized your placeholder"
      controlPosition={SearchBarPosition}
      onPlacesChanged={props.onPlacesChanged}
    />
    {props.resultPlaces.map( (place, key) => 
      <Marker
        defaultAnimation={2}
        position={place.geometry.location}
        key={place.place_id}
        onClick={() => props.onClickMarker(place)}
        onRightClick={() => props.onMarkerRightClick(place)}
      />
    )}
    {props.activityPlaces.map( (place, key) => 
      <Marker
        defaultAnimation={2}
        position={place.geometry.location}
        key={place.place_id}
        icon={StarIcon}
        label={(key+1).toString()}
        onClick={() => props.onClickMarker(place)}
        onRightClick={() => props.onMarkerRightClick(place)}
      />
    )}
  </GoogleMap>
));

export default class TripMapBox extends Component {

  static propTypes = {
    center: PropTypes.object.isRequired,
    activityPlaces : PropTypes.array,

    selectMarker: PropTypes.func.isRequired,
    addActivity: PropTypes.func.isRequired
  }

  constructor(props){
    super(props);
    this.state = {
      // hold search place result
      resultPlaces: [],
      // the search area bound of search box
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

  // save the searchbox object
  handleSearchBoxLoad = (searchbox) => {
    this._searchBoxComponent = searchbox;
    if(searchbox) {
      console.log(searchbox);
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
  
  handlePlaceChanged = () => {
    const resultPlaces = this._searchBoxComponent.getPlaces();
    if (resultPlaces.length == 0) return;

    // Clear old markers
    this.setState({ resultPlaces: [] });

    // For each place, get the icon, name and location.
    let bounds = new google.maps.LatLngBounds();

    resultPlaces.forEach((place) => {

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

    this.setState({resultPlaces});
    this._mapComponent.fitBounds(bounds);
  }

  // Bias the SearchBox results towards current map's viewport. 
  // Search in current area
  handleBoundChanged = () => {
    const bounds = this._mapComponent.getBounds();
    this.setState({ bounds });
  }

  render() {
    return (
      <TripMap
        containerElement={ContainerBox}
        mapElement={MapBox}

        center={this.props.center}
        bounds={this.state.bounds}
        resultPlaces={this.state.resultPlaces}
        activityPlaces={this.props.activityPlaces}

        onMapLoad={this.handleMapLoad}
        onSearchBoxLoad={this.handleSearchBoxLoad}

        onMapClick={this.handleMapClick}
        
        onMarkerRightClick={this.handleMarkerRightClick}
        onClickMarker={this.props.selectMarker}
        // set search place result
        onPlacesChanged={this.handlePlaceChanged}
        // bind google map bound to search range
        onSetBounds={this.handleBoundChanged}
        
      />
    );
  }
}

TripMapBox.defaultProps = {
  activityPlaces : []
};