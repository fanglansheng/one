import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { Link } from "react-router";
import { Col } from "react-bootstrap";

import trip from "../../trip";
const { getAllTrips } = trip.selector;

const { fetchCreateTrip, fetchDeleteTrip, selectTrip } = trip.action;
import "./TripListStyle.scss";

const TripItem = props => {
  return (
    <div className="trip-item">
      <Link to={`/trip/${props.id}`} onClick={props.handleClick}>
        {props.title}
      </Link>
      <i className="material-icons" onClick={props.handleDelete}>
        clear
      </i>
    </div>
  );
};

export default class TripList extends React.Component {
  static propTypes = {
    isFetching: PropTypes.bool.isRequired,
    trips: PropTypes.array.isRequired,

    fetchAllTrips: PropTypes.func.isRequired,
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
  componentWillMount() {
    this.props.fetchAllTrips();
  }

  handleSubmit = e => {
    if (e.charCode !== 13) return;
    const { title } = this.state;
    this.props.addTrip({ title });
    this.setState({ title: "" });
  };

  render() {
    const { trips, isFetching, addTrip, selectTrip, deleteTrip } = this.props;

    const { title } = this.state;

    if (isFetching) return null;

    return (
      <Col md={8} lg={8}>
        {/* Create Form */}
        <div className="create-trip-form">
          <i className="material-icons">add</i>
          <input
            type="text"
            value={title}
            placeholder="Name your new trip"
            onKeyPress={this.handleSubmit}
            onChange={e => this.setState({ title: e.target.value })}
          />
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
      </Col>
    );
  }
}

// const mapStateToProps = (state, props) => {
//   const { isFetching } = state.trips;

//   return {
//     isFetching,
//     trips: getAllTrips(state)
//   };
// };

// const mapDispatchToProps = dispatch => {
//   return {
//     selectTrip: tripData => dispatch(selectTrip(tripData)),
//     deleteTrip: tripId => dispatch(fetchDeleteTrip(tripId)),
//     addTrip: tripData => dispatch(fetchCreateTrip(tripData))
//   };
// };

// export default connect(mapStateToProps, mapDispatchToProps)(MyTripList);
