import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";

// components
import ActivityItem from "./Activity";
import core from "../../core";
const { EditableBox, SingleSelectButton } = core;

// style
import "./ItineraryStyle.scss";

// datetime is moment object.
const sortAscTime = (a, b) => a.datetime - b.datetime;

const RouteBox = props =>
  <div>
    {props.duration.text}
  </div>;

export default class Itinerary extends React.Component {
  static propTypes = {
    // the trip id.
    id: PropTypes.number.isRequired,
    // the name of the trip
    title: PropTypes.string.isRequired,
    memo: PropTypes.string.isRequired,
    // array of trip activity objects.
    activities: PropTypes.array.isRequired,
    // The routes information between two activity place.
    // Routes are calculated based on the order of activities
    routes: PropTypes.array.isRequired,

    handleCalculateRoute: PropTypes.func.isRequired,
    handleEditItinerary: PropTypes.func.isRequired,
    // editActivity(activityId, data), tripId already bind
    editActivity: PropTypes.func.isRequired,
    // delActivity(activityId), tripId already bind
    delActivity: PropTypes.func.isRequired
  };

  constructor(props) {
    super(props);
    this.state = {
      title: props.title,
      memo: props.memo
    };
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.title !== this.props.title) {
      this.setState({ title: nextProps.title });
    }
    if (nextProps.memo !== this.props.memo) {
      this.setState({ memo: nextProps.memo });
    }
  }

  handleDeleteActivity = (activityId, e) => {
    e.preventDefault();
    e.stopPropagation();
    const { id } = this.props;
    this.props.delActivity(id, activityId);
  };

  handleSubmitMemo = e => {
    e.preventDefault();
    e.stopPropagation();
    if (e.charCode !== 13) return;
    this.props.handleEditItinerary({ memo: this.state.memo });
  };

  handleSubmitTitle = e => {
    e.preventDefault();
    e.stopPropagation();
    if (e.charCode !== 13) return;
    if (this.state.title === "") {
      console.error("Title cannot be empty");
      return;
    }
    this.props.handleEditItinerary({ title: this.state.title });
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
      routes
    } = this.props;

    const { title, memo } = this.state;

    return (
      <div>
        {activities.length > 2 &&
          <SingleSelectButton
            options={travelModes}
            buttonText="Show Route"
            defaultOption="DRIVING"
            handleSubmit={this.handleCalculateRoute}
          />}

        <div className="plan-header">
          <EditableBox
            className="title"
            value={title}
            placeholder="Title"
            handleSubmit={this.handleSubmitTitle}
            handleChange={e => this.setState({ title: e.target.value })}
          />
          <EditableBox
            className="description"
            value={memo}
            placeholder="Click to add memo"
            handleSubmit={this.handleSubmitMemo}
            handleChange={e => this.setState({ memo: e.target.value })}
          />
        </div>

        <div className="plan-content">
          {activities.map((activity, index) =>
            <div key={index}>
              <ActivityItem
                {...activity}
                handleDelete={e => this.handleDeleteActivity(activity.id, e)}
                handleEdit={data => editActivity(id, activity.id, data)}
              />
              {index < routes.length && <RouteBox {...routes[index]} />}
            </div>
          )}
        </div>
      </div>
    );
  }
}
