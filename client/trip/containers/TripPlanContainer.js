/***** Trip Plan Page
 * Contains: map + trip itinerary
 */
import { default as React, PropTypes, Component } from "react";
import { connect } from "react-redux";
import {
  selectMarker,
  fetchTripIfNeeded,
  fetchCreateActivity
} from "../tripActions";

import { makeGetTrip, makeGetCenter } from "../selector.js";

// Components
import TripPlan from "../components/TripPlan";

import "./tripPlanStyle.scss";

class TripPlanContainer extends Component {
  static propTypes = {
    dispatch: PropTypes.func.isRequired
  };

  constructor(props) {
    super(props);
  }

  componentWillMount() {
    const { dispatch, tripId } = this.props;
    dispatch(fetchTripIfNeeded(tripId));
  }

  render() {
    const { dispatch, tripId } = this.props;

    return (
      <TripPlan
        {...this.props}
        selectMarker={place => dispatch(selectMarker(place))}
        addActivity={act => dispatch(fetchCreateActivity(tripId, act))}
      />
    );
  }
}

const mapStateToProps = (state, props) => {
  const { selectedPlace } = state;
  const { tripId } = props.params;

  if (state.trips.allItems.length == 0) {
    return {
      tripId,
      activityPlaces: [],
      selectedPlace
    };
  }

  const getTrip = makeGetTrip(tripId);
  const trip = getTrip(state);

  const activityPlaces = trip.activities.map(a => a.place);

  // const getCenter = makeGetCenter(props.tripId);
  // const center = getCenter(state);

  return {
    tripId,
    activityPlaces,
    selectedPlace
  };
};

export default connect(mapStateToProps)(TripPlanContainer);
