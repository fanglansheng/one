/**
 * search expida, studentuniverse..
 */
'use strict';
import React, { PropTypes} from 'react';
import moment from 'moment';
import { DateRangePicker } from 'react-dates';

const START_DATE = 'startDate';

export default class SearchForm extends React.Component {
	static propTypes = {
	}

	constructor(props){
		super(props);
		this.state = {
			focusedInput : START_DATE,
			startDate : null,
			endDate : null,
			departure: '',
			destination: '',
			number: 0
		};
	}

	onInputChange = (e) => {
		const target = e.target;
		const name = target.name;
		const value = target.value;
		this.setState({ [name]: value });
	}

	onDatesChange = ({ startDate, endDate }) => {
		this.setState({ startDate, endDate });
	}

	onFocusChange = (focusedInput) => {
		this.setState({ focusedInput });
	}

	render(){
		const {
			focusedInput,
			startDate,
			endDate,
			departure,
			destination,
			number
		} = this.state;

		return (
			<div>
				{/* position picker*/}
				{/* date picker*/}
				<DateRangePicker
					isOutsideRange={date => date.year() < 2015} //false
					startDate={startDate}
					endDate={endDate}
					onDatesChange={this.onDatesChange}
					focusedInput={focusedInput}
					onFocusChange={this.onFocusChange}
				/>
			</div>
		);
	}

}