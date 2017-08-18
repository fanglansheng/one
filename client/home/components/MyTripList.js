import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { Link } from "react-router";

import trip from "../../trip";
const { getAllTrips } = trip.selector;

const { fetchCreateTrip, fetchDeleteTrip, selectTrip } = trip.action;
import "./MyTripListStyle.scss";

const TripItem = props => {
  return (
    <div>
      <Link to={`/trip/${props.id}`} onClick={props.handleClick}>
        {props.title}
      </Link>
      <i className="material-icons" onClick={props.handleDelete}>
        clear
      </i>
      <p>
        {props.memo}
      </p>
    </div>
  );
};

class MyTripList extends React.Component {
  static propTypes = {
    isFetching: PropTypes.bool.isRequired,
    trips: PropTypes.array.isRequired,

    selectTrip: PropTypes.func.isRequired,
    deleteTrip: PropTypes.func.isRequired,
    addTrip: PropTypes.func.isRequired
  };

  constructor(props) {
    super(props);
    this.state = {
      title: ""
    };
  }

  handleSubmit = () => {
    const { title } = this.state;
    this.props.addTrip({ title });
    this.setState({ title: "" });
  };

  render() {
    const { trips, isFetching, addTrip, selectTrip, deleteTrip } = this.props;

    const { title } = this.state;

    if (isFetching) return null;

    return (
      <div className="content-box">
        {/* Create Form */}
        <div className="create-trip-form">
          <label>Create Trip</label>
          <input
            type="text"
            value={title}
            onChange={e => this.setState({ title: e.target.value })}
          />
          <button onClick={this.handleSubmit}>Create</button>
        </div>
        <div>
          {trips.map((trip, key) =>
            <TripItem
              {...trip}
              key={key}
              handleClick={() => selectTrip(trip)}
              handleDelete={() => deleteTrip(trip.id)}
            />
          )}
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state, props) => {
  const { isFetching } = state.trips;

  return {
    isFetching,
    trips: getAllTrips(state)
  };
};

const mapDispatchToProps = dispatch => {
  return {
    selectTrip: tripData => dispatch(selectTrip(tripData)),
    deleteTrip: tripId => dispatch(fetchDeleteTrip(tripId)),
    addTrip: tripData => dispatch(fetchCreateTrip(tripData))
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(MyTripList);
