'use strict';
import {
	default as React,
	PropTypes
} from 'react';

import {
	DateRangePicker
} from 'react-dates';

const START_DATE = 'startDate';


export default class CreateTripForm extends React.Component {
	static propTypes = {
		onSubmit : PropTypes.func.isRequired,
		onClose : PropTypes.func.isRequired
	}

	constructor(props) {
		super(props);
		this.state = { 
			title: 'New Title',
			days: 1,
			memo: '',
			focusedInput: START_DATE,
			startDate: null,
			endDate: null
		};
	}

	handleChange = (event) => {
		const { name, value } = event.target;
		this.setState({ [name]: value });
	}

	handleSubmit = () => {
		const {
			title,
			days,
			memo
		} = this.state;
		
		this.props.onSubmit({
			title,
			days,
			memo
		});
	}

	handleDatesChange = ({ startDate, endDate }) => {
		this.setState({ startDate, endDate });
	}

	handleFocusChange = (focusedInput) => {
		this.setState({ focusedInput });
	}

	render(){

		const {
			title,
			days,
			memo,
			startDate,
			endDate
		} = this.state;

		return (
			<div>
				<button onClick={this.props.onClose}>Close</button>
				<div>
					<label>Title</label>
					<input
						type="text"
						name="title"
						value={title}
						onChange={this.handleChange}
					/>
				</div>

				<div>
					<label>Days</label>
					<input
						min={1}
						type="number"
						name="days"
						value={days}
						onChange={this.handleChange}
					/>
				</div>

				<div>
					<label>Memo</label>
					<input
						type="text"
						name="memo"
						value={memo}
						onChange={this.handleChange}
					/>
				</div>

				{/*
					<DateRangePicker
						startDate={startDate}
						endDate={endDate}
						onDatesChange={this.handleDatesChange}
						focusedInput={this.state.focusedInput}
						onFocusChange={this.handleFocusChange}
					/>
				*/}	
				<button onClick={this.handleSubmit}>Create</button>
			</div>
		);
	}
}
