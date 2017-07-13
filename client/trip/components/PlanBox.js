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
	fetchCreateDay,
	fetchDeleteDay,
	fetchEditDay,
	addPlaceToTrip
} from '../tripActions';

import core from '../../core';
const { PlaceDetail } = core;

import Itinerary from './Itinerary';
import { makeGetTrip } from '../selector.js';

class PlanBox extends React.Component {

	static propTypes = {
		isFetching : PropTypes.bool.isRequired,

		id : PropTypes.number.isRequired,
		title : PropTypes.string.isRequired,
		memo : PropTypes.string.isRequired,
		itineraries : PropTypes.array.isRequired,

		addDay : PropTypes.func.isRequired,
		deleteDay : PropTypes.func.isRequired
	}

	constructor(props) {
		super(props);
		this.state = {
			memo : this.props.memo || ''
		};
	}

	handleMemoChange = (e) => {
		this.setState({meme: e.target.value});
	}

	handleAddPlace = () => {
		const {
			dispatch,
			selectedPlace
		} = this.props;
		dispatch(addPlaceToTrip(selectedPlace,null));
	}

	render() {
		const {
			isFetching,
			id,
			title,
			memo,
			itineraries,
			selectedPlace,
			addDay,
			editDay,
			deleteDay
		} = this.props;

		if(isFetching) return null;

		return (
			<div className='plan-box'>
				<PlaceDetail
					place={selectedPlace}
					handleAddPlace={this.handleAddPlace}
				/>
				{/*<h4>{title}</h4>*/}
				<p>{memo}</p>
				{ itineraries.map( (it,index) => 
					<Itinerary {...it}
						key={index}
						dayIndex={index+1}
						handleDelete={() => deleteDay(id, it.id)}
						handleEdit={(data) => editDay(id, it.id, data)}
					/>
				)}
				<button onClick={() => addDay(id, {})}>Add a day</button>
			</div>
		);
	}
}

const mapStateToProps = (state, props) => {
	const {
		places,
		selectedPlace,
		trips
	} = state;

	const { currentTripId, isFetching } = trips;
	const getTrip = makeGetTrip(currentTripId);
	const currentTrip = getTrip(state) || {
		id: -1,
		title: '',
		memo: '',
		itineraries: []
	};

	return {
		places,
		selectedPlace,
		...currentTrip,
		isFetching
	};
};

const mapDispatchToProps = (dispatch) => {
	return {
		addDay : (tripId, data) => dispatch(fetchCreateDay(tripId, data)),
		editDay: (tripId, itId, data) => dispatch(fetchEditDay(tripId, itId, data)),
		deleteDay : (tripId, itId) => dispatch(fetchDeleteDay(tripId, itId)),
	}
};

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(PlanBox);