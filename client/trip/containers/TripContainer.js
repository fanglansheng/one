/***** Trip Plan Page
 * Contains: map + trip itinerary
 */
import { default as React, PropTypes, Component } from "react";
import { connect } from "react-redux";
// functions
import { fetchTripIfNeeded } from "../tripActions";
import { makeGetTrip } from "../selector.js";

// Components
import MapContainer from "./MapContainer";
import PlanContainer from "./PlanContainer";

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
        <PlanContainer tripId={tripId} />
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

  return {
    isFetching,
    tripId,
    currentTrip
  };
};

export default connect(mapStateToProps)(TripContainer);
