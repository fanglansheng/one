/***** Trip Plan Page
 * Contains: map + trip itinerary
 */
import { default as React, PropTypes, Component } from "react";
import { connect } from "react-redux";
import {
  fetchTripIfNeeded,
  fetchEditTrip,
  fetchDeleteActivity,
  fetchEditActivity,
  fetchCreateActivity,
  addDirection,
  delDirection
} from "../tripActions";

import {
  makeGetTrip,
  makeGetClassifiedActivities,
  getAllDirections
} from "../selector.js";

// Components
import Trip from "../components/Trip";
import MapContainer from "./MapContainer";

import "./TripPlanStyle.scss";

class TripContainer extends Component {
  static propTypes = {
    dispatch: PropTypes.func.isRequired
  };

  constructor(props) {
    super(props);

    const { dispatch, tripId } = this.props;
    dispatch(fetchTripIfNeeded(tripId));
  }

  render() {
    const { dispatch, tripId, isFetching, currentTrip } = this.props;
    console.log(isFetching); // fetching take too much time!
    if (isFetching || !currentTrip) return null;
    return (
      <div className="app-container">
        <MapContainer tripId={tripId} />
        <Trip
          {...this.props}
          editActivity={(activityId, data) =>
            dispatch(fetchEditActivity(activityId, data))}
          delActivity={activityId =>
            dispatch(fetchDeleteActivity(tripId, activityId))}
          editItinerary={data => dispatch(fetchEditTrip(tripId, data))}
          addDirection={(date, route) => dispatch(addDirection(date, route))}
          delDirection={date => dispatch(delDirection(date))}
        />
      </div>
    );
  }
}

const mapStateToProps = (state, props) => {
  // this is current trip id.
  const { tripId } = props.params;
  const { isFetching } = state.trips;

  const getTrip = makeGetTrip(tripId);
  const currentTrip = getTrip(state);

  const getClassifiedActivities = makeGetClassifiedActivities(tripId);
  const dayItineraries = getClassifiedActivities(state);

  const directions = getAllDirections(state);

  return {
    isFetching,
    tripId,
    directions,
    currentTrip,
    dayItineraries
  };
};

export default connect(mapStateToProps)(TripContainer);
