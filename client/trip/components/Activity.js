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
const {
  EditableTextLabel,
  EditableNumberLabel,
  VisitTypeButton,
  constantss
} = core;

import "./ActivityStyle.scss";

const TimeFormat = "h:mm a";
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

    this.state = {
      startTime: utcToLocal(props.startTime, offset),
      visitType: props.visitType,
      duration: props.duration,
      memo: props.memo,
      dateFocused: false
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

  handleSetTime = time => {
    this.setState({ startTime: time });

    // local to utc
    const offset = this.props.place.utc_offset;
    const utcTime = time.utcOffset(offset).format();

    this.props.handleEdit({ startTime: utcTime });
  };

  render() {
    const { place, handleDelete, handleEdit } = this.props;
    const { startTime, duration, memo, visitType, dateFocused } = this.state;
    const mDuration = moment.duration(duration);
    const hour = mDuration.get("h") ? mDuration.get("h") + "h" : "";
    const min = mDuration.get("m") ? mDuration.get("m") + "min" : "";
    const durationText = `${hour} ${min}`;

    return (
      <div className="activity-item">
        <div className="activity-header">
          <SingleDatePicker
            numberOfMonths={1}
            date={startTime}
            focused={dateFocused}
            onDateChange={this.handleSetDate}
            onFocusChange={({ focused }) =>
              this.setState({ dateFocused: focused })}
          />

          <TimePicker
            className="time-picker"
            placeholder="Time"
            showSecond={false}
            value={startTime}
            onChange={this.handleSetTime}
            format={TimeFormat}
            use12Hours
          />

          <button onClick={handleDelete}>
            <i className="material-icons">clear</i>
          </button>
        </div>

        <div className="activity-content">
          <h5>
            {place.name}
          </h5>

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
            className="duration-picker"
            value={duration}
            placeholder="HH:MM"
            labelText={durationText}
            handleSubmit={() => handleEdit({ duration })}
            handleChange={e => this.setState({ duration: e.target.value })}
          />

          <EditableTextLabel
            value={memo}
            placeholder="edit"
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
