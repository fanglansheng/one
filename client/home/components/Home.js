import React from "react";
import { Grid, Row } from "react-bootstrap";
import Navigation from "./Navigation";

export default class Home extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <Grid>
        <Row>
          <div className="logo">Trip Planner</div>
        </Row>
        <Row>
          <Navigation />
          {this.props.children}
        </Row>
      </Grid>
    );
  }
}
