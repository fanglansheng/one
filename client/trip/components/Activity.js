/***** component items */
import React from "react";
import PropTypes from "prop-types";
import moment from "moment";

// components
import { SingleDatePicker } from "react-dates";
import TimePicker from "rc-time-picker";
import core from "../../core";
const { EditableBox } = core;

const format = "h:mm a";
const defaultTime = moment().hour(9).minute(0);
const DatetimeFormat = "YYYYMMDD HH:mm ZZ";

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
      dateTime = moment(props.date);
    }

    this.state = {
      datetime: dateTime,
      memo: props.memo,
      duration: props.duration,
      dateFocused: false
    };
  }

  handleMemoSubmit = e => {
    if (e.charCode !== 13) return;
    this.props.handleEdit({ memo: this.state.memo });
  };

  // handleDateSubmit = date => {
  //   // set date of datetime
  //   const _y = date.year();
  //   const _m = date.month();
  //   const _d = date.date();

  //   const { datetime } = this.state;
  //   let newDate;

  //   if (!datetime) {
  //     this.setState({ datetime: date });
  //     newDate = date;
  //   } else {
  //     newDate = this.state.datetime;
  //     newDate.set({ year: _y, month: _m, date: _d });
  //     this.setState({ datetime: newDate });
  //   }

  //   const offset = this.props.place.utc_offset;
  //   newDate = newDate.utcOffset(offset).format();
  //   this.props.handleEdit({ datetime: newDate });
  // };

  // handleTimeChange = time => {
  //   // change the time of datetime
  //   const _h = time.hour();
  //   const _m = time.minute();

  //   const { datetime } = this.state;
  //   let newTime;

  //   if (!datetime) {
  //     this.setState({ datetime: time });
  //     newTime = time;
  //   } else {
  //     newTime = this.state.datetime;
  //     newTime.set({ hour: _h, minute: _m });
  //     this.setState({ datetime: newTime });
  //   }

  //   // local to utc
  //   const offset = this.props.place.utc_offset;
  //   newTime = newTime.utcOffset(offset).format();

  //   this.props.handleEdit({ datetime: newTime });
  // };

  handleTimeChange = time => {
    this.setState({ datetime: time });
    console.log(time);

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
          <i className="fa fa-times" />
        </button>

        <SingleDatePicker
          numberOfMonths={1}
          date={datetime}
          focused={dateFocused}
          onDateChange={this.handleTimeChange}
          onFocusChange={({ focused }) =>
            this.setState({ dateFocused: focused })}
        />

        <TimePicker
          className="time-picker"
          placeholder="Time"
          showSecond={false}
          value={datetime}
          onChange={this.handleTimeChange}
          format={format}
          use12Hours
        />

        <div className="activity-info">
          <h5>
            {place.name}
          </h5>
          <EditableBox
            value={memo}
            icon="fa fa-pencil"
            placeholder="edit"
            handleSubmit={this.handleMemoSubmit}
            handleChange={e => this.setState({ memo: e.target.value })}
          />
        </div>
      </div>
    );
  }
}

ActivityItem.defaultProps = defaultProps;
