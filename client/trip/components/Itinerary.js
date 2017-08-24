import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";

// components
import ActivityItem from "./Activity";
import core from "../../core";
const { SingleSelectButton, EditableTextLabel } = core;

// datetime is moment object.
const sortAscTime = (a, b) => a.datetime - b.datetime;

const RouteBox = props =>
  <div className="route-box">
    <span>
      {props.distance.text}
    </span>
    <span>
      {props.duration.text}
    </span>
  </div>;

const travelModes = [
  { value: google.maps.TravelMode.BICYCLING, icon: "directions_bike" },
  { value: google.maps.TravelMode.DRIVING, icon: "directions_car" },
  { value: google.maps.TravelMode.TRANSIT, icon: "directions_bus" },
  { value: google.maps.TravelMode.WALKING, icon: "directions_walk" }
];

export default class Itinerary extends React.Component {
  static propTypes = {
    // the trip id.
    id: PropTypes.number.isRequired,
    // the name of the trip
    title: PropTypes.string.isRequired,
    // array of trip activity objects.
    activities: PropTypes.array.isRequired,
    // The routes information between two activity place.
    // Routes are calculated based on the order of activities
    routes: PropTypes.array.isRequired,

    handleCalculateRoute: PropTypes.func.isRequired,
    // editItinerary(data)
    editItinerary: PropTypes.func.isRequired,
    // editActivity(activityId, data), tripId already bind
    editActivity: PropTypes.func.isRequired,
    // delActivity(activityId), tripId already bind
    delActivity: PropTypes.func.isRequired
  };

  constructor(props) {
    super(props);
    this.state = {
      title: props.title
    };
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.title !== this.props.title) {
      this.setState({ title: nextProps.title });
    }
  }

  handleDeleteActivity = (activityId, e) => {
    const { id } = this.props;
    this.props.delActivity(id, activityId);
  };

  handleSubmit = e => {
    if (e.charCode !== 13) return;

    this.props.editItinerary({
      title: this.state.title
    });
  };

  getSortedActivities = () => {
    const sorted = this.props.activities.sort(sortAscTime);
  };

  render() {
    const {
      id,
      activities,
      addActivity,
      editActivity,
      delActivity,
      routes,
      handleCalculateRoute
    } = this.props;

    const { title } = this.state;

    return (
      <div className="itinerary">
        <EditableTextLabel
          className="plan-header"
          placeholder="Title"
          value={title}
          labelText={title}
          handleSubmit={this.handleSubmit}
          handleChange={e => this.setState({ title: e.target.value })}
        />

        <div className="plan-content">
          {activities.map((activity, index) =>
            <div key={activity.id}>
              <ActivityItem
                {...activity}
                index={index + 1}
                handleDelete={e => this.handleDeleteActivity(activity.id, e)}
                handleEdit={data => editActivity(activity.id, data)}
              />
              {index < routes.length && <RouteBox {...routes[index]} />}
            </div>
          )}
          <span>Use the search bar to search a place and add it.</span>
        </div>

        <div className="itinerary-toolbar">
          {activities.length > 1 &&
            <SingleSelectButton
              options={travelModes}
              buttonText="Show Route"
              defaultOption="DRIVING"
              handleSubmit={handleCalculateRoute}
            />}
        </div>
      </div>
    );
  }
}
