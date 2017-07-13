'use strict';
import {
	default as React,
	PropTypes
} from 'react';

import {
	Link
} from 'react-router';

import { 
	connect
} from 'react-redux';

import core from '../../core';
const {
  fetchCreateTrip,
  fetchDeleteTrip,
  selectTrip
} = core;

import trip from '../../trip';
const {
	makeGetAllTrips
} = trip.selector;

import moment from 'moment';

import CreateTripForm from './CreateTripForm';

const formatDate = date => moment(date).local().format('MM/DD/YYYY');

const TripItem = (props) => {
	// const start = formatDate(props.startDate);
	// const end = formatDate(props.endDate);
	const dayLength = props.itineraries.length;
	const suffix = dayLength > 1 ? 's' : '';
	const title = `${dayLength} day${suffix} Trip ${props.title}`;
	return (
		<div>
			<Link
				to={`/trip/${props.id}`}
				onClick={props.handleClick}
			> {title} </Link>
			<button onClic={props.handleDelete}></button>
			<div> {props.memo} </div>
		</div>
	);
};

class TripBox extends React.Component {
	static propTypes = {
		isFetching : PropTypes.bool.isRequired,
		trips : PropTypes.array.isRequired,

		selectTrip : PropTypes.func.isRequired,
		deleteTrip : PropTypes.func.isRequired,
		addTrip : PropTypes.func.isRequired
	}

	constructor(props) {
		super(props);
		this.state = {
			showCreateForm : false
		};
	}

	handleShowForm = () => this.setState({showCreateForm: true})
	handleHideForm = () => this.setState({showCreateForm: false})

	render(){
		const {
			trips,
			isFetching,
			addTrip,
			selectTrip,
			deleteTrip
		} = this.props;

		const {
			showCreateForm
		} = this.state;

		if(isFetching) return null;

		return (
			<div className='content-box'>
				<button onClick={this.handleShowForm}>
					Create New Trip
				</button>
				{ showCreateForm && 
					<CreateTripForm 
						onSubmit={addTrip}
						onClose={this.handleHideForm}
					/>
				}
				<div>
					{trips.map((trip,key) => 
						<TripItem
							{...trip} key={key}
							handleClick={() => selectTrip(trip)}
							handleDelete={() => deleteTrip(trip.id)}
						/>
					)}
				</div>
			</div>
		);
	}
}

const mapStateToProps = (state, props) => {
	const {
		isFetching
	} = state.trips;

	const getAllTrips = makeGetAllTrips();
	return {
		isFetching,
		trips : getAllTrips(state)
	};
};

const mapDispatchToProps = (dispatch) => {
	return {
		selectTrip : (tripData) => dispatch(selectTrip(tripData)),
		deleteTrip : (tripId) => dispatch(fetchDeleteTrip(tripId)),
		addTrip : (tripData) => dispatch(fetchCreateTrip(tripData))
	};
}

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(TripBox);
