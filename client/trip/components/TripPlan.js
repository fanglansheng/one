import { default as React, PropTypes } from "react";

// components
import TripMap from "./TripMap";
import Itinerary from "./Itinerary";
import PlaceInfo from "./PlaceInfo";

export default class TripPlan extends React.Component {
  static propTypes = {
    tripId: PropTypes.string.isRequired,
    activityPlaces: PropTypes.array.isRequired,
    // functions
    selectMarker: PropTypes.func.isRequired,
    addActivity: PropTypes.func.isRequired
  };

  constructor(props) {
    super(props);
    this.state = {
      // the route to activity places.
      directions: null
    };
  }

  calculateAndDisplayRoute = () => {
    const { activityPlaces } = this.props;
    const directionsService = new google.maps.DirectionsService();

    const last = activityPlaces.length - 1;
    const waypoints = [];
    activityPlaces.forEach((place, index) => {
      if (index != 0 && index != last) {
        waypoints.push({
          location: place.geometry.location,
          stopover: true
        });
      }
    });

    directionsService.route(
      {
        origin: activityPlaces[0].geometry.location,
        destination: activityPlaces[last].geometry.location,
        travelMode: google.maps.TravelMode.DRIVING,
        waypoints: waypoints,
        optimizeWaypoints: true,
        provideRouteAlternatives: true
      },
      (response, status) => {
        if (status === google.maps.DirectionsStatus.OK) {
          console.log(response);
          this.setState({
            directions: response
          });
        } else {
          console.error(`error fetching directions ${response.status}`);
        }
      }
    );
  };

  render() {
    const { directions } = this.state;
    const { tripId, activityPlaces, addActivity, selectedPlace } = this.props;

    return (
      <div className="full-height">
        {/* Map */}
        <TripMap
          directions={directions}
          activityPlaces={activityPlaces}
          selectMarker={this.props.selectMarker}
        />

        {/* Information and activity */}
        <div className="plan-side-bar">
          <div>
            <button onClick={this.calculateAndDisplayRoute}>show route</button>
          </div>
          <PlaceInfo
            place={selectedPlace}
            handleAddPlace={() => addActivity(tripId, selectedPlace.place_id)}
          />
          <Itinerary directions={directions} />
        </div>
      </div>
    );
  }
}
