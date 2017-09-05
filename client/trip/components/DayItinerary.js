import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import moment from "moment";

// components
import ActivityItem from "./Activity";
import RouteButton from "./RouteButton";

// style
import "./DayItineraryStyle.scss";

// datetime is moment object.
const sortAscTime = (a, b) => a.datetime - b.datetime;

const RouteBox = props => (
  <div className="route-box">
    <span>
      {props.distance.text} - {props.duration.text}
    </span>
  </div>
);

export default class DayItinerary extends React.Component {
  static propTypes = {
    // the trip id.
    tripId: PropTypes.number.isRequired,
    // the date of this itinerary
    date: PropTypes.string.isRequired,
    // array of trip activity objects.
    activities: PropTypes.array.isRequired,
    // editActivity(activityId, data), tripId already bind
    editActivity: PropTypes.func.isRequired,
    // delActivity(activityId), tripId already bind
    delActivity: PropTypes.func.isRequired,
    addDirection: PropTypes.func.isRequired,
    delDirection: PropTypes.func.isRequired
  };

  constructor(props) {
    super(props);
    this.state = { routes: {} };
  }

  handleDeleteDay = () => {
    // reset activity time to null.
    this.props.activities.foreach(activity => {
      this.props.editActivity(activity.id, { startTime: "" });
    });
  };

  // set the date of acticities when drop
  handleDrop = e => {
    e.preventDefault();
    const activityId = e.dataTransfer.getData("activityId");
    const startTime = e.dataTransfer.getData("startTime");
    const offset = e.dataTransfer.getData("utcOffset");

    if (this.props.date === "Unassigned") {
      this.props.editActivity(activityId, { startTime: "" });
      return;
    }

    const date = moment(this.props.date);
    const _y = date.year();
    const _m = date.month();
    const _d = date.date();

    let newDate = startTime === "null" ? date : moment(startTime);
    // update selected date.
    newDate.set({ year: _y, month: _m, date: _d });
    newDate = newDate.utcOffset(offset).format();

    this.props.editActivity(activityId, { startTime: newDate });
  };

  handleDragover = e => {
    e.preventDefault();
  };

  getSortedActivities = () => {
    const sorted = this.props.activities.sort(sortAscTime);
  };

  calculateRoute = travelMode => {
    const { activities, date, addDirection } = this.props;

    const directionsService = new google.maps.DirectionsService();

    const last = activities.length - 1;
    const waypoints = [];
    activities.forEach((activity, index) => {
      if (index != 0 && index != last) {
        waypoints.push({
          location: activity.place.geometry.location,
          stopover: true
        });
      }
    });

    directionsService.route(
      {
        origin: activities[0].place.geometry.location,
        destination: activities[last].place.geometry.location,
        travelMode: travelMode,
        waypoints: waypoints,
        optimizeWaypoints: true,
        provideRouteAlternatives: true
      },
      (response, status) => {
        if (status === google.maps.DirectionsStatus.OK) {
          addDirection(date, response);
          this.setState({ routes: response.routes[0].legs });
        } else {
          console.error(`error fetching directions ${response.status}`);
        }
      }
    );
  };

  clearRoute = () => {
    const { date, delDirection } = this.props;
    delDirection(date);
    this.setState({ routes: [] });
  };

  renderActivities() {
    const { activities, delActivity, editActivity } = this.props;
    const { routes } = this.state;
    if (activities.length === 0) {
      return (
        <div className="no-content">
          <i>No content</i>
        </div>
      );
    } else {
      return activities.map((activity, index) => (
        <div key={activity.id}>
          <ActivityItem
            {...activity}
            activityId={activity.id.toString()}
            index={index + 1}
            handleDelete={() => delActivity(activity.id)}
            handleEdit={data => editActivity(activity.id, data)}
          />
          {index < routes.length && <RouteBox {...routes[index]} />}
        </div>
      ));
    }
  }

  render() {
    const { id, date, activities, routes } = this.props;
    // const routes = d ? d.routes[0].legs : [];
    const showRoute = date !== "Unassigned" && activities.length > 1;
    return (
      <div
        className="itinerary"
        onDrop={this.handleDrop}
        onDragEnter={this.handleDragover}
        onDragOver={this.handleDragover}
      >
        <h4 className="itinerary-header">{date}</h4>
        <div className="itinerary-toolbar">
          {showRoute && (
            <RouteButton
              onCalculateDirection={this.calculateRoute}
              onClearDirection={this.clearRoute}
            />
          )}
        </div>
        <div className="itinerary-content">{this.renderActivities()}</div>
      </div>
    );
  }
}
