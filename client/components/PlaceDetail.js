import {
  default as React,
  Component,
  PropTypes
} from 'react';

export default class DetailBox extends Component {
	static propTypes = {
		place : PropTypes.any.isRequired,
    handleAddPlace : PropTypes.func.isRequired
  }

  constructor(props){
    super(props);
    this.state = {
    };
  }

  render(){
  	const {
  		place,
      handleAddPlace
  	} = this.props;
    if(!place.name) return null;
  	return(
  		<div className="info-container">
  			<h4>{place.name} {place.rating}</h4>
        <a href={place.url}>Open in GoogleMap</a>
        <p>{place.formatted_address}</p>
  			<button onClick={handleAddPlace}>Add to trip</button>
  		</div>
  	);
  }
}