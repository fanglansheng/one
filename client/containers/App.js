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
  getPlaceDetail
} from '../defaultActions';

import MapContainer from './MapContainer';
import PlaceDetail from '../components/PlaceDetail';


export class App extends React.Component {

	static propTypes = {
		dispatch : PropTypes.func.isRequired
	}

	constructor(props) {
		super(props);
	}

	componentWillMount() {
		const { dispatch, params } = this.props;
		
	}

	componentWillReceiveProps(nextProps) {
		const { dispatch, params } = nextProps;
	}


	render() {
		const {
			dispatch,
			places,
			selectedPlace
		} = this.props;

		return (
			<div className='app-container'>
				<MapContainer/>
				<PlaceDetail
					place={selectedPlace}
				/>
			</div>
		);
	}
}

const mapStateToProps = (state, props) => {
	const {
		places,
		selectedPlace
	} = state;
	return {
		places,
		selectedPlace
	};
};

export default connect(
	mapStateToProps, 
)(App);