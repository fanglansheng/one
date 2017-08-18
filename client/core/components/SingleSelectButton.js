/**
 * How to use:
 * <SingleSelectButton
 *    options={travelModes}
 *    defaultOption="DRIVING"
 *    handleSubmit={handleCalculateRoute}
 * />
 * Render a list of <option_buttons> and a <submit_button>.
 * Users can only select one option from the button list. 
 * Click the <submit_button> to submit result.
 * 1. options {array}: [{value: 'DRIVING', icon:'car'}, {} ...]
 * 2. defaultOption {string}
 * 3. handleSubmit {func}
 */
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
    // class name of SingleSelectButton
    className: PropTypes.string,
    // button name of the <option_buttons>
    buttonName: PropTypes.string,
    // the text shows on the <submit_button>
    buttonText: PropTypes.string,

    // the default option selected when render the button list.
    defaultOption: PropTypes.string.isRequired,
    // options that can be [{value: 'DRIVING', icon:'car'}]
    options: PropTypes.array.isRequired,
    // call back function when user click the <submit_button>; handleSubmit(data)
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
              {option.icon
                ? <i className="material-icons">
                    {option.icon}
                  </i>
                : option.value}
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
