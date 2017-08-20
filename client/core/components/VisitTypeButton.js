import React from "react";
import { DropdownButton, MenuItem } from "react-bootstrap";
import { VisitType } from "../constants";

import "./VisitTypeButton.scss";

const VisitTypeButton = ({ id, value, handleSelect }) =>
  <DropdownButton
    className="btn-visit-type"
    title={value}
    id={id}
    onSelect={handleSelect}
  >
    {Object.keys(VisitType).map(key =>
      <MenuItem key={key} eventKey={VisitType[key].value}>
        {VisitType[key].value}
      </MenuItem>
    )}
  </DropdownButton>;
export default VisitTypeButton;
