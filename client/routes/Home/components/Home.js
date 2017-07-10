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
	Link
} from 'react-router';

import {
  // fetchCurrentLocation
  fetchAllTrips,
  addPlaceToTrip
} from '../../../defaultActions';

import Navigation from './Navigation';

class Home extends React.Component {

	static propTypes = {
		dispatch : PropTypes.func.isRequired
	}

	constructor(props) {
		super(props);
	}

	componentWillMount() {
		const { dispatch, params } = this.props;
		dispatch(fetchAllTrips());
	}

	componentWillReceiveProps(nextProps) {
		const { dispatch, params } = nextProps;
	}

	render() {

		return (
			<div className='full-height'>
				<Navigation />
				{this.props.children}
			</div>
		);
	}
}


export default connect(
	null
)(Home);