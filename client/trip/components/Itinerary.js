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

import moment from 'moment';

const EditableBox = (props) => {
	if(props.focused){
		return (
			<input
				type='text'
				value={props.value}
				placeholder={props.placeholder}
				onChange={props.handleChange}
				onKeyPress={props.handleSubmit}
			/>
		);
	} else {
		return (
			<div onClick={props.showEditInput}>
				{props.value || 'click to edit'}
			</div>
		);
	}
};

const ActivityItem = (props) => (
	<div>
		<p>{props.name}</p>
		<p>{props.address}</p>
	</div>
);

export default class Itinerary extends React.Component {

	static propTypes = {
		date : PropTypes.any,
		memo : PropTypes.string,
		activities : PropTypes.array,
		dayIndex : PropTypes.number.isRequired,

		handleDelete: PropTypes.func.isRequired,
		handleEdit: PropTypes.func.isRequired
	}

	constructor(props) {
		super(props);
		this.state = {
			date : props.date ? moment(props.date) : null,
			memo : props.memo || '',
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
		this.setState({ date });
		this.props.handleEdit({
			date: date.format('YYYYMMDD')
		});
	}

	render() {
		const {
			dayIndex,
			activities,
			handleDelete
		} = this.props;

		const {
			date,
			memo,
			memoFocused,
			dateFocused
		} = this.state;

		return (
			<div className='itinerary-item'>
				<div>{dayIndex}</div>
				<SingleDatePicker
					numberOfMonths={1}
					date={date}
					focused={dateFocused}
					onDateChange={this.handleDateSubmit}
					onFocusChange={({focused}) => this.setState({ dateFocused:focused })}
				/>
				<EditableBox
					focused={memoFocused}
					value={memo}
					placeholder='edit'
					handleSubmit={this.handleMemoSubmit}
					handleChange={e => this.setState({memo: e.target.value})}
					showEditInput={() => this.setState({memoFocused: true})}
				/>
				<button onClick={handleDelete}>delete</button>
				{activities.map((act,key) =>
					<ActivityItem key={key} {...act}/>
				)}
			</div>
		);
	}
}