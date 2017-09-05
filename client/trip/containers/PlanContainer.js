import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";

// functions
import {
  fetchEditTrip,
  fetchDeleteActivity,
  fetchEditActivity,
  addDirection,
  delDirection
} from "../tripActions";
import {
  makeGetTrip,
  getAllDirections,
  makeGetClassifiedActivities
} from "../selector.js";

// components
import { SingleDatePicker } from "react-dates";
import ActivityItem from "../components/Activity";
import DayItinerary from "../components/DayItinerary";
import core from "../../core";
const { EditableTextLabel } = core;

// style
import "./PlanStyle.scss";

class Plan extends React.Component {
  static propTypes = {
    // the trip id.
    id: PropTypes.number.isRequired,
    // the name of the trip
    title: PropTypes.string.isRequired,
    // array of objects
    dayItineraries: PropTypes.array.isRequired,

    // editItinerary(data)
    editItinerary: PropTypes.func.isRequired,
    // editActivity(activityId, data), tripId already bind
    editActivity: PropTypes.func.isRequired,
    // delActivity(activityId), tripId already bind
    delActivity: PropTypes.func.isRequired,
    // directions function
    addDirection: PropTypes.func.isRequired,
    delDirection: PropTypes.func.isRequired
  };

  constructor(props) {
    super(props);
    this.state = {
      tempItineraries: [],
      title: props.title,
      dateFocused: false
    };
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.title !== this.props.title) {
      this.setState({ title: nextProps.title });
    }
    const updatedDates = nextProps.dayItineraries.map(it => it.date);
    const allDates = [...this.state.tempItineraries, ...updatedDates];
    const filtered = allDates.filter(date => !updatedDates.includes(date));
    this.setState({ tempItineraries: filtered });
  }

  handleEditTitle = e => {
    if (e.charCode !== 13) return;
    this.props.editItinerary({ title: this.state.title });
  };

  handleAddDay = dateInput => {
    this.setState({
      tempItineraries: [
        ...this.state.tempItineraries,
        dateInput.format("YYYY/MM/DD")
      ]
    });
  };

  checkDayBlocked = date => {
    const blockedDates = this.props.dayItineraries.map(it => it.date);
    const formatedDate = date.format("YYYY/MM/DD");
    return blockedDates.includes(formatedDate);
  };

  render() {
    const {
      id,
      dayItineraries,
      editActivity,
      delActivity,
      addDirection,
      delDirection
    } = this.props;

    const { title, tempItineraries, dateFocused, showAddDay } = this.state;

    return (
      <div className="plan">
        <EditableTextLabel
          className="plan-header"
          placeholder="Title"
          value={title}
          labelText={title}
          onSubmit={this.handleEditTitle}
          onChange={val => this.setState({ title: val })}
        />

        <div className="plan-content">
          {dayItineraries.map((itinerary, key) => (
            <DayItinerary
              key={key}
              tripId={id}
              date={itinerary.date}
              activities={itinerary.activities}
              editActivity={editActivity}
              delActivity={delActivity}
              addDirection={addDirection}
              delDirection={delDirection}
            />
          ))}
          {tempItineraries.map((date, key) => (
            <DayItinerary
              key={`empty-itinerary-${key}`}
              tripId={id}
              date={date}
              activities={[]}
              editActivity={editActivity}
              delActivity={delActivity}
              addDirection={addDirection}
              delDirection={delDirection}
            />
          ))}

          <div className="btn-add-day">
            <SingleDatePicker
              numberOfMonths={2}
              placeholder="+ Add date"
              withPortal
              daySize={46}
              focused={dateFocused}
              onDateChange={this.handleAddDay}
              onFocusChange={({ focused }) =>
                this.setState({ dateFocused: focused })}
              isDayBlocked={this.checkDayBlocked}
            />
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state, props) => {
  // this is current trip id.
  const { tripId } = props;
  const { isFetching } = state.trips;

  const getTrip = makeGetTrip(tripId);
  const currentTrip = getTrip(state);

  const getClassifiedActivities = makeGetClassifiedActivities(tripId);
  const dayItineraries = getClassifiedActivities(state);

  const directions = getAllDirections(state);

  return {
    ...currentTrip,
    isFetching,
    dayItineraries
  };
};

const mapDispatchToProps = (dispatch, props) => {
  const { tripId } = props;
  return {
    editActivity: (aId, data) => dispatch(fetchEditActivity(aId, data)),
    delActivity: aId => dispatch(fetchDeleteActivity(tripId, aId)),
    editItinerary: data => dispatch(fetchEditTrip(tripId, data)),
    addDirection: (date, route) => dispatch(addDirection(date, route)),
    delDirection: date => dispatch(delDirection(date))
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Plan);
