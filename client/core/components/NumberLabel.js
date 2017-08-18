/** EditableNumberLabel
 * Display the information like static dom when not focused. Click 
 * <EditableNumberLabel/> to show the input field. Hit 'enter' to submit the edit.
 * 
 * How to use:
 * EditableNumberLabel = withEditable(NumberLabel);
 *  <EditableNumberLabel
 *    value={value}
 *    handleChange={()=>{}}
 *    handleSubmit={()=>{}}
 *  />);
 */
import React from "react";
import PropTypes from "prop-types";
import "./EditableLabelStyle.scss";

export default class NumberLabel extends React.Component {
  static propTypes = {
    placeholder: PropTypes.string,

    // bind the value to show in the input dom element
    value: PropTypes.any.isRequired,
    // set value when it changes
    handleChange: PropTypes.func.isRequired,

    // pass through props
    editable: PropTypes.bool.isRequired,
    handleEnableEdit: PropTypes.func.isRequired,
    handleDisableEditAndSubmit: PropTypes.func.isRequired
  };

  constructor(props) {
    super(props);
    this.state = {
      errorMsg: ""
    };
  }

  handleEnter = e => {
    if (e.charCode === 13) {
      this.props.handleDisableEditAndSubmit();
    }
  };

  validation = () => {
    if (this.state.value === "") {
      this.setState({ errorMsg: "Cannot be empty!" });
    }
  };

  render() {
    const {
      className,
      value,
      placeholder,
      handleChange,

      editable,
      handleEnableEdit,
      handleDisableEditAndSubmit
    } = this.props;
    return (
      <div className={className}>
        {editable
          ? <input
              type="number"
              value={value}
              min={0.5}
              max={24}
              step={0.5}
              onChange={handleChange}
              onKeyPress={handleDisableEditAndSubmit}
              onBlur={this.handleEnter}
              autoFocus
            />
          : <span className="editable-label" onClick={handleEnableEdit}>
              {value || "Click to edit"}
            </span>}
      </div>
    );
  }
}
