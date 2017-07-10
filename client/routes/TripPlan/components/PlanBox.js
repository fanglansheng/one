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

import {
	fetchCreateDay
} from '../tripActions';

import PlaceDetail from '../../../components/PlaceDetail';
import Itinerary from './Itinerary';


class PlanBox extends React.Component {

	static propTypes = {
		id : PropTypes.number.isRequired,
		title : PropTypes.string.isRequired,
		memo : PropTypes.string.isRequired,
		itineraries : PropTypes.array.isRequired,

		addDay : PropTypes.func.isRequired
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
			id,
			title,
			memo,
			itineraries,
			selectedPlace,
			addDay
		} = this.props;

		return (
			<div className='plan-box'>
				<PlaceDetail
					place={selectedPlace}
					handleAddPlace={this.handleAddPlace}
				/>
				<h4>{title}</h4>
				<p>{memo}</p>
				{ itineraries.map( (it,index) => {
					<Itinerary key={index} dayIndex={index+1} {...it}/>
				})}
				<button onClick={() => addDay(id, {})}>Add a day</button>
			</div>
		);
	}
}

const mapStateToProps = (state, props) => {
	const {
		places,
		selectedPlace,
		currentTrip
	} = state;

	return {
		places,
		selectedPlace,
		...currentTrip
	};
};

const mapDispatchToProps = (dispatch) => {
	return {
		addDay : (tripId, data) => dispatch(fetchCreateDay((tripId, data))),
	}
};

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(PlanBox);