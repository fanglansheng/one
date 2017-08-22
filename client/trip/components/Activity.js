/**
 * Activity
 * Itinieraty is consist of a list of Activities. An activity is an action 
 * happens in ONE DAY's itinerary.
 * Activity contains: 
 * 1. Destination: google place object, 
 * 2. Start datetime: moment object,
 * 3. Duration: number of hours which not exceed 24h,
 * 4. Memo(to do list).
 * 
 * How to use:
 * <ActivityItem
 *  place={place_object}
 *  handleDelete={e => deleteActivity(activity.id, e)}
 *  handleEdit={data => editActivity(activity.id, data)}
 * />
 */

import React from "react";
import PropTypes from "prop-types";
import moment from "moment";

// components
import { SingleDatePicker } from "react-dates";
import TimePicker from "rc-time-picker";
import core from "../../core";
const { EditableTextLabel, VisitTypeButton, constantss } = core;

import "./ActivityStyle.scss";

const TimeFormat = "hh:mm a";
const defaultProps = {
  memo: ""
};

function utcToLocal(datetime, offset) {
  if (datetime) {
    return moment.utc(datetime).utcOffset(offset);
    // console.log(dateTime.format());
  } else {
    return null;
  }
}

export default class ActivityItem extends React.Component {
  static propTypes = {
    startTime: PropTypes.any,
    visitType: PropTypes.string,
    duration: PropTypes.string,
    memo: PropTypes.string,

    // activity place
    place: PropTypes.object.isRequired,
    // delete the activity
    handleDelete: PropTypes.func.isRequired,
    // called when change the activity data
    handleEdit: PropTypes.func.isRequired
  };

  constructor(props) {
    super(props);
    const offset = props.place.utc_offset;
    const datetime = utcToLocal(props.startTime, offset);

    this.state = {
      startTime: datetime,
      time: datetime.format(TimeFormat),
      visitType: props.visitType,
      duration: props.duration,
      memo: props.memo,
      dateFocused: false,
      expand: true
    };
  }

  handleSubmit = name => {
    this.props.handleEdit({
      [name]: this.state[name]
    });
  };

  // update the date when change but keep the time
  handleSetDate = date => {
    const _y = date.year();
    const _m = date.month();
    const _d = date.date();

    const { startTime } = this.state;
    let newDate;

    if (!startTime) {
      newDate = date;
    } else {
      // set old startTime to newDate
      newDate = startTime;
      // update selected date.
      newDate.set({ year: _y, month: _m, date: _d });
    }

    this.setState({ startTime: newDate });

    const offset = this.props.place.utc_offset;
    newDate = newDate.utcOffset(offset).format();
    this.props.handleEdit({ startTime: newDate });
  };

  handleSetTime = () => {
    let [hour, minute, am] = this.state.time.split(/[:\s]/);
    let { startTime } = this.state;

    if (am[0] === "p" || am[0] === "P") {
      hour = parseInt(hour) + 12;
    }
    minute = parseInt(minute);
    startTime.set({ hour, minute });
    // local to utc
    const offset = this.props.place.utc_offset;
    const utcTime = startTime.utcOffset(offset).format();
    this.props.handleEdit({ startTime: utcTime });
  };

  checkTimeInput = e => {
    const { value } = e.target;
    const regx = /^(0?[1-9]|1[012])(:[0-5]\d) [APap][mM]$/;
    const result = regx.exec(value);
    if (!result) {
      console.log("invalid input");
      return;
    }
    this.setState({ time: e.target.value });
  };

  toggleExpand = () => {
    this.setState({ expand: !this.state.expand });
  };

  render() {
    const { place, index, handleDelete, handleEdit } = this.props;
    const {
      startTime,
      time,
      duration,
      memo,
      visitType,
      dateFocused
    } = this.state;
    const mDuration = moment.duration(duration);
    const hour = mDuration.get("h") ? mDuration.get("h") + "h" : "";
    const min = mDuration.get("m") ? mDuration.get("m") + "min" : "";
    const durationText = `${hour} ${min}`;

    return (
      <div className="activity-item">
        <span className="activity-index">
          {index}
        </span>

        <div className="activity-header" onClick={this.toggleExpand}>
          {place.name}
          <button className="btn-delete" onClick={handleDelete}>
            <i className="material-icons">clear</i>
          </button>
        </div>

        <div className="activity-content">
          <div>
            <SingleDatePicker
              numberOfMonths={1}
              date={startTime}
              focused={dateFocused}
              onDateChange={this.handleSetDate}
              onFocusChange={({ focused }) =>
                this.setState({ dateFocused: focused })}
            />

            <EditableTextLabel
              value={time}
              className="time-picker"
              placeholder="09:30 AM"
              labelText={time}
              handleSubmit={this.handleSetTime}
              handleChange={this.checkTimeInput}
            />

            <EditableTextLabel
              className="time-picker"
              value={duration}
              placeholder="HH:MM"
              labelText={durationText}
              handleSubmit={() => handleEdit({ duration })}
              handleChange={e => this.setState({ duration: e.target.value })}
            />
          </div>

          <VisitTypeButton
            id="activity-visit-type"
            value={visitType}
            handleSelect={val => {
              console.log(val);
              this.setState({ visitType: val });
              handleEdit({ visitType: val });
            }}
          />

          <EditableTextLabel
            value={memo}
            placeholder="edit"
            className="memo-label"
            labelText={memo || "Click to edit memo"}
            handleSubmit={() => handleEdit({ memo })}
            handleChange={e => this.setState({ memo: e.target.value })}
          />
        </div>
      </div>
    );
  }
}

ActivityItem.defaultProps = defaultProps;
