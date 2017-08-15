import React from "react";
import PropTypes from "prop-types";

import {
  ButtonToolbar,
  ToggleButtonGroup,
  ToggleButton
} from "react-bootstrap";
// import style
import "./SingleSelectButton.scss";

const defaultProps = {
  buttonText: "Submit",
  buttonName: "toggleButtonGroup"
};

export default class SingleSelectButton extends React.Component {
  static propTypes = {
    className: PropTypes.string,
    buttonName: PropTypes.string,
    buttonText: PropTypes.string,
    defaultOption: PropTypes.string,
    // options that can select [{value, icon, }]
    options: PropTypes.array.isRequired,
    // sumbit the result.
    handleSubmit: PropTypes.func.isRequired
  };

  constructor(props) {
    super(props);
    this.state = {
      selectedOption: props.defaultOption
    };
  }

  handleSetOption = val => {
    this.setState({ selectedOption: val });
  };

  handleClick = () => {
    const { selectedOption } = this.state;
    this.props.handleSubmit(selectedOption);
  };

  render() {
    const { selectedOption } = this.state;
    const {
      className,
      buttonText,
      buttonName,
      defaultOption,
      options,
      handleSubmit
    } = this.props;
    return (
      <ButtonToolbar className={className}>
        <ToggleButtonGroup
          name={buttonName}
          type="radio"
          defaultValue={defaultOption}
          onChange={this.handleSetOption}
        >
          {options.map((option, i) =>
            <ToggleButton className="btn-toggle" key={i} value={option.value}>
              {option.icon ? <i className={option.icon} /> : option.value}
            </ToggleButton>
          )}
        </ToggleButtonGroup>
        <button className="btn-submit" onClick={this.handleClick}>
          {buttonText}
        </button>
      </ButtonToolbar>
    );
  }
}

SingleSelectButton.defaultProps = defaultProps;
