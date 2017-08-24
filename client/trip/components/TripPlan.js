import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";

// components
import { SingleDatePicker } from "react-dates";
import ActivityItem from "./Activity";
import DayItinerary from "./DayItinerary";
import core from "../../core";
const { SingleSelectButton, EditableTextLabel } = core;
import "./PlanStyle.scss";

export default class Plan extends React.Component {
  static propTypes = {
    // the trip id.
    id: PropTypes.number.isRequired,
    // the name of the trip
    title: PropTypes.string.isRequired,
    // array of arrays [[date1], [date2] ... ]
    activities: PropTypes.array.isRequired,
    // array of objects
    dayItineraries: PropTypes.array.isRequired,

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
      title: props.title,
      dateFocused: false,
      dateInput: null
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

  handleAddDay = () => {
    this.setState({
      dayItineraries: [
        ...this.state.dayItineraries,
        { date: null, activities: [] }
      ]
    });
  };

  render() {
    const {
      id,
      activities,
      dayItineraries,
      addActivity,
      editActivity,
      delActivity
    } = this.props;

    const { title, dateFocused, dateInput } = this.state;

    return (
      <div className="plan">
        <div>
          <EditableTextLabel
            className="plan-header"
            placeholder="Title"
            value={title}
            labelText={title}
            handleSubmit={this.handleSubmit}
            handleChange={e => this.setState({ title: e.target.value })}
          />
          {/* add date buttton */}
          <div>
            <SingleDatePicker
              numberOfMonths={1}
              placeholder="Add a day"
              date={dateInput}
              focused={dateFocused}
              onDateChange={dateInput => this.setState({ dateInput })}
              onFocusChange={({ focused }) =>
                this.setState({ dateFocused: focused })}
            />
            <button className="btn-add" onClick={this.handleAddDay}>
              +
            </button>
          </div>
        </div>

        <div className="plan-content">
          {dayItineraries.map((itinerary, key) =>
            <DayItinerary
              key={key}
              tripId={id}
              date={itinerary.date}
              activities={itinerary.activities}
              editActivity={editActivity}
              delActivity={delActivity}
            />
          )}
        </div>
      </div>
    );
  }
}
