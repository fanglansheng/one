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
	fetchCreateActivity,
	fetchDeleteActivity,
	fetchEditActivity,
	addPlaceToTrip
} from '../tripActions';

import core from '../../core';
const { PlaceDetail } = core;

import ActivityItem from './Activity';
import { makeGetTrip } from '../selector.js';

class PlanBox extends React.Component {

	static propTypes = {
		isFetching : PropTypes.bool.isRequired,

		id : PropTypes.number.isRequired,
		title : PropTypes.string.isRequired,
		memo : PropTypes.string.isRequired,
		activities : PropTypes.array.isRequired,

		addActivity : PropTypes.func.isRequired,
		deleteActivity : PropTypes.func.isRequired
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
			activities,
			selectedPlace,
			addActivity,
			editActivity,
			deleteActivity
		} = this.props;

		if(isFetching) return null;

		return (
			<div className='plan-box'>
				<PlaceDetail
					place={selectedPlace}
					handleAddPlace={this.handleAddPlace}
				/>
				<h4>{title}</h4>
				<p>{memo}</p>
				<button 
					onClick={() => addActivity(id, selectedPlace.place_id)}
				>Add Activity</button>
				{ activities.map( (it,index) => 
					<ActivityItem {...it}
						key={index}
						handleDelete={() => deleteActivity(id, it.id)}
						handleEdit={(data) => editActivity(id, it.id, data)}
					/>
				)}
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
		activities: []
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
		addActivity : (tripId, placeId) => {
			dispatch(fetchCreateActivity(tripId, placeId));
		},
		editActivity: (tripId, activityId, data) => {
			dispatch(fetchEditActivity(tripId, activityId, data));
		},
		deleteActivity : (tripId, activityId) => {
			dispatch(fetchDeleteActivity(tripId, activityId))
		}
	}
};

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(PlanBox);