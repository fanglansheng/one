/** EditableBox
 * Function: Display the information like static dom when not focused. Click 
 * EditableBox to show the input field and act like a input dom. Hit 'enter'
 * to submit the edit.
 */
import React from "react";
import PropTypes from "prop-types";
import "./EditableBoxStyle.scss";

const defaultProps = {
  className: "",
  inputType: "text",
  placeholder: "click to edit",
  icon: "fa fa-pencil",
  autoFocus: false,
  notEmpty: false
};

export default class EditableBox extends React.Component {
  static propTypes = {
    // the type of the input. Default is 'text'
    className: PropTypes.string,
    inputType: PropTypes.string,
    placeholder: PropTypes.string,
    icon: PropTypes.string,
    autoFocus: PropTypes.bool,
    notEmpty: PropTypes.bool,

    // bind the value to show in the input dom element
    value: PropTypes.any.isRequired,
    // set value when it changes
    handleChange: PropTypes.func.isRequired,
    // called when user hit 'enter'
    handleSubmit: PropTypes.func.isRequired
  };

  constructor(props) {
    super(props);
    this.state = {
      editable: props.autoFocus,
      errorMsg: ""
    };
  }

  handleEnableEdit = e => {
    this.setState({ editable: true });
  };

  handleBlur = e => {
    this.setState({ editable: false });
    this.props.handleSubmit(e);
  };

  handleSubmitValue = e => {
    if (e.charCode !== 13) return;

    // disable eidt.
    this.setState({ editable: false });
    this.props.handleSubmit(e);
  };

  validation = () => {
    if (this.props.notEmpty && this.state.value === "") {
      this.setState({ errorMsg: "Cannot be empty!" });
    }
  };

  render() {
    const {
      className,
      icon,
      value,
      inputType,
      placeholder,
      handleChange
    } = this.props;
    const { editable } = this.state;
    return (
      <div className={`editable-box ${className}`}>
        {icon && <i className={`icon ${icon}`} />}
        {editable
          ? <input
              type={inputType}
              value={value}
              placeholder={placeholder}
              onChange={handleChange}
              onKeyPress={this.handleSubmitValue}
              onBlur={this.handleBlur}
              autoFocus
            />
          : <span onClick={this.handleEnableEdit}>
              {value || "Click to edit"}
            </span>}
      </div>
    );
  }
}

EditableBox.defaultProps = defaultProps;
