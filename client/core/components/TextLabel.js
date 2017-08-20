/** EditableTextLabel
 * Display the information like static dom when not focused. Click 
 * <EditableTextLabel/> to show the input field. Hit 'enter' to submit the edit.
 * 
 * How to use:
 * EditableTextLabel = withEditable(TextLabel);
 *  <EditableTextLabel
 *    value={value}
 *    handleChange={()=>{}}
 *    handleSubmit={()=>{}}
 *  />);
 */
import React from "react";
import PropTypes from "prop-types";
import "./EditableLabelStyle.scss";

const defaultProps = {
  inputType: "text",
  notEmpty: false
};

export default class TextLabel extends React.Component {
  static propTypes = {
    placeholder: PropTypes.string,
    notEmpty: PropTypes.bool,

    // bind the value to show in the input dom element
    value: PropTypes.any.isRequired,
    labelText: PropTypes.string.isRequired,
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
    if (this.props.notEmpty && this.state.value === "") {
      this.setState({ errorMsg: "Cannot be empty!" });
    }
  };

  render() {
    const {
      className,
      value,
      labelText,
      placeholder,
      handleChange,

      editable,
      handleEnableEdit,
      handleDisableEditAndSubmit
    } = this.props;

    if (editable) {
      return (
        <input
          className={className}
          type="text"
          value={value}
          placeholder={placeholder}
          onChange={handleChange}
          onBlur={handleDisableEditAndSubmit}
          onKeyPress={this.handleEnter}
          autoFocus={true}
        />
      );
    } else {
      return (
        <span
          className={`editable-label ${className}`}
          onClick={handleEnableEdit}
        >
          {labelText}
        </span>
      );
    }
  }
}

TextLabel.defaultProps = defaultProps;
