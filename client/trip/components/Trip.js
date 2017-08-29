import React from "react";
import PropTypes from "prop-types";

// components
import Plan from "./Plan";

export default class Trip extends React.Component {
  static propTypes = {
    currentTrip: PropTypes.object.isRequired,
    dayItineraries: PropTypes.array.isRequired,
    // functions
    addActivity: PropTypes.func.isRequired, //addActivity(object)
    editActivity: PropTypes.func.isRequired,
    delActivity: PropTypes.func.isRequired,
    // editItinerary(data)
    editItinerary: PropTypes.func.isRequired,

    addDirection: PropTypes.func.isRequired,
    delDirection: PropTypes.func.isRequired
  };

  constructor(props) {
    super(props);
    this.state = {};
  }

  calculateRoute = (travelMode, activityPlaces) => {
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
        travelMode: travelMode,
        waypoints: waypoints,
        optimizeWaypoints: true,
        provideRouteAlternatives: true
      },
      (response, status) => {
        if (status === google.maps.DirectionsStatus.OK) {
          console.log(response);
          this.setState({ directions: response });
        } else {
          console.error(`error fetching directions ${response.status}`);
        }
      }
    );
  };

  render() {
    const {
      currentTrip,
      dayItineraries,
      directions,
      addActivity,
      editActivity,
      delActivity,
      selectedPlace,
      editItinerary,
      addDirection,
      delDirection
    } = this.props;

    return (
      <div className="app-container">
        {/* Map */}
        {/* <TripMap
          directions={directions}
          activities={currentTrip.activities}
          addActivity={placeId => addActivity(placeId)}
        /> */}

        <Plan
          {...currentTrip}
          dayItineraries={dayItineraries}
          editItinerary={editItinerary}
          editActivity={editActivity}
          delActivity={delActivity}
          handleCalculateRoute={this.calculateRoute}
          addDirection={addDirection}
          delDirection={delDirection}
        />
      </div>
    );
  }
}
