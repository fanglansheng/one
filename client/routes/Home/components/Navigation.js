import {
	default as React,
} from 'react';

import {
	Link
} from 'react-router';

const Navigation = () => (
	<div className='navigation'>
		{/* logo */}
		<h3>Trip Planner</h3>
		<p>Hello user</p>

		<div className='nav-item'>
			<Link to='/trip'>My Trips</Link>
		</div>
		<div className='nav-item'>
			<Link to='/map'>My Map</Link>
		</div>
	</div>
);

export default Navigation;