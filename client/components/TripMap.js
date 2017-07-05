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

// window['ww']=(SearchBox);
const GettingStartedGoogleMap = withGoogleMap(props => (
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
    {props.markers.map( (marker, key) => (
      <Marker
        {...marker}
        key={key}
        onClick={() => props.onClickMarker(marker.place)}
        onRightClick={() => props.onMarkerRightClick(marker)}
      />
    ))}
  </GoogleMap>
));

export default class GettingStartedExample extends Component {
  static propTypes = {
    getPlaceDetail: PropTypes.func.isRequired
  }

  constructor(props){
    super(props);
    this.state = {
      markers: [],
      bounds: new google.maps.LatLngBounds()
    };
  }

  componentWillMount(){

  }

  // save the map object
  handleMapLoad = (map) => {
    this._mapComponent = map;
    if (map) {
      console.log(map.getZoom());
    }
  }

  /*
   * This is called when you click on the map.
   * Go and try click now.
   */
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

    // const icon = {
    //     url: place.icon,
    //     size: new google.maps.Size(71, 71),
    //     origin: new google.maps.Point(0, 0),
    //     anchor: new google.maps.Point(17, 34),
    //     scaledSize: new google.maps.Size(25, 25)
    //   };

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
    const places = this._searchBoxComponent.getPlaces();
    if (places.length == 0) return;

    // Clear old markers
    this.setState({ markers: [] });

    // For each place, get the icon, name and location.
    let markers = [];
    let bounds = new google.maps.LatLngBounds();
    places.forEach((place) => {
      // console.log(place);

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
      markers.push({
        defaultAnimation: 2,
        place: place,
        position: place.geometry.location
      });

    });
    this.setState({markers});
    this._mapComponent.fitBounds(bounds);

  }

  // Bias the SearchBox results towards current map's viewport.
  handleBoundChanged = () => {
    const bounds = this._mapComponent.getBounds();
    this.setState({ bounds });
  }

  handleClickMarker = (place) => {
    console.log(place.place_id);
    this.props.getPlaceDetail(place);
  }

  render() {
    return (
      <GettingStartedGoogleMap
        containerElement={ContainerBox}
        mapElement={MapBox}
        onMapLoad={this.handleMapLoad}
        onMapClick={this.handleMapClick}
        markers={this.state.markers}
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