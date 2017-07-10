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
  // fetchCurrentLocation
  addPlaceToTrip
} from '../../../defaultActions';


export default class Itinerary extends React.Component {

	static propTypes = {
		dayIndex : PropTypes.number.isRequired,
		date : PropTypes.any,
		memo : PropTypes.string.isRequired,
		activities : PropTypes.array
	}

	constructor(props) {
		super(props);
		this.state = {
			memo : ''
		};
	}

	handleMemoChange = (e) => {
		this.setState({meme: e.target.value});
	}

	render() {
		const {
			dayIndex,
			date,
			activities
		} = this.props;

		return (
			<div className='itinerary-item'>
				<div>{dayIndex}</div>
				<button>delete</button>
			{/*
				<input
					type='text'
					value={memo}
					onChange={this.handleMemoChange}
				/>
			*/}
				
			</div>
		);
	}
}