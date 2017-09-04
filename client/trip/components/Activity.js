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
import core from "../../core";
const { EditableTextLabel, VisitTypeButton, constants } = core;

// style
import "./ActivityStyle.scss";

const TimeFormat = "hh:mm a";
const defaultProps = { memo: "" };

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
    const datetime = constants.utcToLocal(props.startTime, offset);

    this.state = {
      startTime: datetime,
      time: datetime ? datetime.format(TimeFormat) : "",
      visitType: props.visitType,
      duration: props.duration,
      memo: props.memo,
      dateFocused: false,
      expand: true
    };
  }

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
    let { startTime } = this.state;
    let [hour, minute, am] = this.state.time.split(/[:\s]/);

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

  handleDragStart = e => {
    const { activityId, startTime, place } = this.props;
    e.dataTransfer.setData("activityId", activityId);
    e.dataTransfer.setData("startTime", startTime);
    e.dataTransfer.setData("utcOffset", place.utc_offset);
  };

  checkTimeInput = inputValue => {
    const regx = /^(0?[1-9]|1[012])(:[0-5]\d) [APap][mM]$/;
    const result = regx.test(inputValue);
    return result;
  };

  checkDurationInput = inputValue => {
    const regx = /^(\d\d)(:[0-5]\d)$/;
    const result = regx.test(inputValue);
    return result;
  };

  toggleExpand = () => {
    this.setState({ expand: !this.state.expand });
  };

  renderUnassignedActivity() {
    const { place, index, handleDelete } = this.props;

    return (
      <div
        className="unassigned-activity"
        draggable="true"
        onDragStart={this.handleDragStart}
      >
        <span>
          {place.name}
        </span>
        <button className="btn-delete" onClick={handleDelete}>
          <i className="material-icons">clear</i>
        </button>
      </div>
    );
  }

  render() {
    if (this.props.startTime === null) {
      return this.renderUnassignedActivity();
    }

    const { place, index, handleDelete, handleEdit } = this.props;
    const { time, duration, memo, visitType, dateFocused } = this.state;

    const mDuration = moment.duration(duration);
    const hour = mDuration.get("h") ? mDuration.get("h") + "h" : "";
    const min = mDuration.get("m") ? mDuration.get("m") + "min" : "";
    const durationText = `${hour} ${min}`;

    return (
      <div
        className="activity-item"
        draggable="true"
        onDragStart={this.handleDragStart}
        onClick={this.toggleExpand}
      >
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
          <div className="content-item">
            <label>Time</label>
            <EditableTextLabel
              value={time}
              notEmpty
              className="time-picker"
              placeholder="09:30 AM"
              labelText={time}
              validate={this.checkTimeInput}
              onSubmit={this.handleSetTime}
              onChange={val => this.setState({ time: val })}
            />
          </div>
          {/* <div className="time-picker">
            <span>Stay</span>
            <EditableTextLabel
              value={duration}
              notEmpty
              placeholder="HH:MM"
              labelText={durationText}
              validate={this.checkDurationInput}
              onSubmit={() => handleEdit({ duration })}
              onChange={val => this.setState({ duration: val })}
            />
          </div> */}

          <div className="content-item">
            <label>Map icon</label>
            <VisitTypeButton
              id={`activity-visit-type-${index}`}
              value={visitType}
              handleSelect={val => {
                this.setState({ visitType: val });
                handleEdit({ visitType: val });
              }}
            />
          </div>
          <EditableTextLabel
            value={memo}
            placeholder="edit"
            className="content-item memo-label"
            labelText={memo || "Click to edit memo"}
            onSubmit={() => handleEdit({ memo })}
            onChange={val => this.setState({ memo: val })}
          />
        </div>
      </div>
    );
  }
}

ActivityItem.defaultProps = defaultProps;
