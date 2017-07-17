/***** component items */
'use strict';
import {
	default as React,
	PropTypes
} from 'react';

import { 
	connect
} from 'react-redux';

import {
	SingleDatePicker
} from 'react-dates';
import TimePicker from 'rc-time-picker';

import moment from 'moment';
const format = 'h:mm a';
const defaultTime = moment().hour(9).minute(0);
const DatetimeFormat = 'YYYYMMDD HH:mm ZZ';

const EditableBox = (props) => (
	<div>
		<i className='fa fa-pencil'/>{' '}
		{ props.focused ? (
				<input
					type='text'
					value={props.value}
					placeholder={props.placeholder}
					onChange={props.handleChange}
					onKeyPress={props.handleSubmit}
				/>
			):(
				<span onClick={props.showEditInput}>
					{props.value || 'click to edit'}
				</span>
			)
		}
	</div>
);

export default class ActivityItem extends React.Component {

	static propTypes = {
		date : PropTypes.any,
		memo : PropTypes.string,
		duration : PropTypes.number,

		place : PropTypes.object.isRequired,

		handleDelete: PropTypes.func.isRequired,
		handleEdit: PropTypes.func.isRequired
	}

	constructor(props) {
		super(props);
		let dateTime = null;
		if(props.date){
			console.log(props.date);
			dateTime = moment(props.date);
		}

		this.state = {
			datetime : dateTime,
			memo : props.memo || '',
			duration : props.duration || 1,
			memoFocused: false,
			dateFocused: false
		};
	}

	handleMemoSubmit = e => {
		e.preventDefault();
		e.stopPropagation();

		if(e.charCode !== 13) return;

		this.props.handleEdit({
			memo:this.state.memo
		});

		this.setState({
			memoFocused : false
		});
	}

	handleDateSubmit = date => {
		// set date of datetime
		const _y = date.year();
		const _m = date.month();
		const _d = date.date();

		const { datetime } = this.state;
		let newDate;

		if(!datetime){
			this.setState({ datetime: date });
			newDate = date;

		} else {
			newDate = this.state.datetime;
			newDate.set({ year: _y, month: _m, date: _d });

			this.setState({ datetime: newDate });
		}

		const offset = this.props.place.utc_offset;

		newDate = newDate.utcOffset(offset).format();

		this.props.handleEdit({ datetime: newDate });
	}

	handleTimeChange = time => {
		// change the time of datetime
		const _h = time.hour();
		const _m = time.minute();

		const { datetime } = this.state;

		let newTime;

		if(!datetime){

			this.setState({ datetime: time });
			newTime = time;

		} else {
			newTime = this.state.datetime;
			newTime.set({ hour: _h, minute: _m });
			this.setState({ datetime: newTime });
		}

		// local to utc
		const offset = this.props.place.utc_offset;

		newTime = newTime.utcOffset(offset).format();

		this.props.handleEdit({ datetime: newTime });
	}

	render() {
		const {
			place,
			handleDelete
		} = this.props;

		const {
			datetime,
			duration,
			memo,
			memoFocused,
			dateFocused
		} = this.state;

		return (
			<div className='activity-item'>
				<button onClick={handleDelete}>
					<i className='fa fa-times'/>
				</button>

				<SingleDatePicker
					numberOfMonths={1}
					date={datetime}
					focused={dateFocused}
					onDateChange={this.handleDateSubmit}
					onFocusChange={({focused}) => this.setState({ dateFocused:focused })}
				/>
				<TimePicker
					className='time-picker'
					placeholder='Time'
					showSecond={false}
					value={datetime}
					onChange={this.handleTimeChange}
					format={format}
					use12Hours
				/>

				<div className='activity-info'>
					<h5>{place.name}</h5>
					
					<EditableBox
						focused={memoFocused}
						value={memo}
						placeholder='edit'
						handleSubmit={this.handleMemoSubmit}
						handleChange={e => this.setState({memo: e.target.value})}
						showEditInput={() => this.setState({memoFocused: true})}
					/>
				</div>
			</div>
		);
	}
}