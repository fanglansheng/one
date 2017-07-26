/***** component items */
"use strict";
import { default as React, PropTypes } from "react";

import { connect } from "react-redux";

import { fetchDeleteActivity, fetchEditActivity } from "../tripActions";

import ActivityItem from "./Activity";
import { makeGetTrip } from "../selector.js";

// datetime is moment object.
const sortAscTime = (a, b) => a.datetime - b.datetime;

class Itinerary extends React.Component {
  static propTypes = {
    isFetching: PropTypes.bool.isRequired,

    id: PropTypes.number.isRequired,
    title: PropTypes.string.isRequired,
    memo: PropTypes.string.isRequired,
    activities: PropTypes.array.isRequired,

    deleteActivity: PropTypes.func.isRequired
  };

  constructor(props) {
    super(props);
    this.state = {
      memo: this.props.memo || ""
    };
  }

  handleMemoChange = e => {
    this.setState({ meme: e.target.value });
  };

  handleDeleteActivity = (activityId, e) => {
    e.preventDefault();
    e.stopPropagation();
    const { id, deleteActivity } = this.props;
    deleteActivity(id, activityId);
  };

  getSortedActivities = () => {
    const sorted = this.props.activities.sort(sortAscTime);
  };

  render() {
    const {
      isFetching,
      id,
      title,
      memo,
      activities,
      addActivity,
      editActivity,
      deleteActivity
    } = this.props;

    if (isFetching) return null;

    return (
      <div>
        <div className="plan-header">
          <h4>
            {title}
          </h4>
          <p>
            {memo}
          </p>
        </div>
        {activities.map((it, index) =>
          <ActivityItem
            {...it}
            key={index}
            handleDelete={e => this.handleDeleteActivity(it.id, e)}
            handleEdit={data => editActivity(id, it.id, data)}
          />
        )}
      </div>
    );
  }
}

const mapStateToProps = (state, props) => {
  const { trips } = state;

  const { currentTripId, isFetching } = trips;
  const getTrip = makeGetTrip(currentTripId);
  const currentTrip = getTrip(state) || {
    id: -1,
    title: "",
    memo: "",
    activities: []
  };

  return {
    ...currentTrip,
    isFetching
  };
};

const mapDispatchToProps = dispatch => {
  return {
    editActivity: (tripId, activityId, data) => {
      dispatch(fetchEditActivity(tripId, activityId, data));
    },
    deleteActivity: (tripId, activityId) => {
      dispatch(fetchDeleteActivity(tripId, activityId));
    }
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Itinerary);
