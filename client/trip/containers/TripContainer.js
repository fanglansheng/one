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
  fetchCreateActivity
} from "../tripActions";

import { makeGetTrip, makeGetClassifiedActivities } from "../selector.js";

// Components
import Trip from "../components/Trip";

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
    if (isFetching || !currentTrip) return null;
    return (
      <Trip
        {...this.props}
        addActivity={placeId => dispatch(fetchCreateActivity(tripId, placeId))}
        editActivity={(activityId, data) =>
          dispatch(fetchEditActivity(tripId, activityId, data))}
        delActivity={activityId =>
          dispatch(fetchDeleteActivity(tripId, activityId))}
        editItinerary={data => dispatch(fetchEditTrip(tripId, data))}
      />
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

  return {
    isFetching,
    tripId,
    currentTrip,
    dayItineraries
  };
};

export default connect(mapStateToProps)(TripContainer);
