import React from "react";
import { Link } from "react-router";
import { Col } from "react-bootstrap";
import "./NavigationStyle.scss";

const Navigation = () =>
  <Col md={4} lg={4} className="navigation-container">
    <div className="nav-header">Hello user</div>

    <div className="nav-menu">
      <Link className="nav-item" to="/trip">
        My Trips
      </Link>
      <Link className="nav-item" to="/map">
        My Map
      </Link>
    </div>
  </Col>;

export default Navigation;
