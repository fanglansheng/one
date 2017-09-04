import React from "react";
import { DropdownButton, MenuItem } from "react-bootstrap";
import { VisitType } from "../constants";

import "./VisitTypeButton.scss";

const Icon = ({ value }) =>
  <i className="material-icons">
    {value}
  </i>;

const VisitTypeButton = ({ id, value, handleSelect }) =>
  <DropdownButton
    id={id}
    className="btn-visit-type"
    title={<Icon value={value} />}
    onSelect={handleSelect}
  >
    {Object.keys(VisitType).map(key =>
      <MenuItem key={key} eventKey={VisitType[key].value} className="menu-icon">
        <i className="material-icons">
          {VisitType[key].value}
        </i>
      </MenuItem>
    )}
  </DropdownButton>;
export default VisitTypeButton;
