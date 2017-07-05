import {
  default as React,
  Component,
  PropTypes
} from 'react';

export default class DetailBox extends Component {
	static propTypes = {
		place: PropTypes.any.isRequired
  }

  constructor(props){
    super(props);
    this.state = {
    };
  }

  render(){
  	const {
  		place
  	} = this.props;
  	return(
  		<div className="info-contianer">
  			<h4>{place.name}</h4>
  			<button>Add to trip</button>
  		</div>
  	);
  }
}