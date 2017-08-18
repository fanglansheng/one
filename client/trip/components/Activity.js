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
const { EditableTextLabel, EditableNumberLabel } = core;

const TimeFormat = "h:mm a";
const defaultProps = {
  date: null,
  memo: "",
  duration: 1
};

export default class ActivityItem extends React.Component {
  static propTypes = {
    date: PropTypes.any,
    memo: PropTypes.string,
    duration: PropTypes.number,

    // activity place
    place: PropTypes.object.isRequired,
    // delete the activity
    handleDelete: PropTypes.func.isRequired,
    // called when change the activity data
    handleEdit: PropTypes.func.isRequired
  };

  constructor(props) {
    super(props);
    let dateTime = null;
    if (props.date) {
      const offset = props.place.utc_offset;
      dateTime = moment.utc(props.date).utcOffset(offset);
      console.log(dateTime.format());
    }

    this.state = {
      datetime: dateTime,
      memo: props.memo,
      duration: props.duration,
      durationEditable: false,
      dateFocused: false
    };
  }

  handleSubmit = e => {
    if (e.charCode !== 13) return;
    this.props.handleEdit({
      memo: this.state.memo,
      duration: this.state.duration
    });
  };

  // update the date when change but keep the time
  handleDateSubmit = date => {
    const _y = date.year();
    const _m = date.month();
    const _d = date.date();

    const { datetime } = this.state;
    let newDate;

    if (!datetime) {
      newDate = date;
    } else {
      // set old datetime to newDate
      newDate = datetime;
      // update selected date.
      newDate.set({ year: _y, month: _m, date: _d });
    }

    this.setState({ datetime: newDate });

    const offset = this.props.place.utc_offset;
    newDate = newDate.utcOffset(offset).format();
    this.props.handleEdit({ datetime: newDate });
  };

  handleTimeChange = time => {
    this.setState({ datetime: time });
    console.log(time && time.format());

    // local to utc
    const offset = this.props.place.utc_offset;
    const utcTime = time.utcOffset(offset).format();

    this.props.handleEdit({ datetime: utcTime });
  };

  render() {
    const { place, handleDelete } = this.props;
    const { datetime, duration, memo, dateFocused } = this.state;

    return (
      <div className="activity-item">
        <button onClick={handleDelete}>
          <i className="material-icons">clear</i>
        </button>

        <SingleDatePicker
          numberOfMonths={1}
          date={datetime}
          focused={dateFocused}
          onDateChange={this.handleDateSubmit}
          onFocusChange={({ focused }) =>
            this.setState({ dateFocused: focused })}
        />

        <TimePicker
          className="time-picker"
          placeholder="Time"
          showSecond={false}
          value={datetime}
          onChange={this.handleTimeChange}
          format={TimeFormat}
          use12Hours
        />

        <div className="activity-info">
          <h5>
            {place.name}
          </h5>
          <div>
            Stay
            <EditableNumberLabel
              className="inline"
              value={duration}
              handleSubmit={this.handleSubmit}
              handleChange={e => this.setState({ duration: e.target.value })}
            />
            hours
          </div>

          <EditableTextLabel
            value={memo}
            placeholder="edit"
            handleSubmit={this.handleSubmit}
            handleChange={e => this.setState({ memo: e.target.value })}
          />
        </div>
      </div>
    );
  }
}

ActivityItem.defaultProps = defaultProps;
