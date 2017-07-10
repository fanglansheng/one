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
  fetchTrip,
  addPlaceToTrip
} from '../../../defaultActions';

import PlanBox from '../components/PlanBox';
import MapContainer from './MapContainer';

class App extends React.Component {

	static propTypes = {
		dispatch : PropTypes.func.isRequired,
	}

	constructor(props) {
		super(props);
	}

	componentWillMount() {
		const { dispatch, params } = this.props;
		dispatch(fetchTrip(params.tripId));
	}

	componentWillReceiveProps(nextProps) {
		const { dispatch, params } = nextProps;
	}

	render() {
		return (
			<div className='full-height'>
				{/* Map */}
				<MapContainer/>
				{/* Information and itineray */}
				<PlanBox/>
			</div>
		);
	}
}

export default connect(
	null
)(App);