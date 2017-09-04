/** EditableTextLabel
 * Display the information like static dom when not focused. Click 
 * <EditableTextLabel/> to show the input field. Hit 'enter' to submit the edit.
 * 
 * How to use:
 * EditableTextLabel = withEditable(TextLabel);
 *  <EditableTextLabel
 *    value={value}
 *    onChange={()=>{}}
 *    onSubmit={()=>{}}
 *  />);
 */
import React from "react";
import PropTypes from "prop-types";
import "./EditableLabelStyle.scss";

const defaultProps = {
  className: "",
  inputType: "text",
  errorMsg: "",
  notEmpty: false
};

export default class TextLabel extends React.Component {
  static propTypes = {
    placeholder: PropTypes.string,
    notEmpty: PropTypes.bool,
    hint: PropTypes.string,

    // bind the value to show in the input dom element
    value: PropTypes.any.isRequired,
    labelText: PropTypes.string.isRequired,
    // set value when it changes
    onChange: PropTypes.func.isRequired,
    // validate(value) => return ture / false
    validate: PropTypes.func,

    // pass through props
    editable: PropTypes.bool.isRequired,
    onEnableEdit: PropTypes.func.isRequired,
    onDisableEditAndSubmit: PropTypes.func.isRequired
  };

  constructor(props) {
    super(props);
    this.state = {
      hover: false,
      showHint: false,
      valid: true
    };
  }

  handleKeyPress = e => {
    if (e.charCode === 13) {
      this.handleSubmit();
    }
  };

  handleSubmit = () => {
    const { valid } = this.state;
    if (valid) {
      this.setState({ showHint: false });
      this.props.onDisableEditAndSubmit();
    } else {
      // show hint
      this.setState({ showHint: true });
      this.refs.labelInput.focus();
    }
  };

  handleChange = e => {
    const { value } = e.target;
    const { notEmpty, validate, onChange } = this.props;
    // update the input value when there is a change.
    onChange(value);

    // validate the input
    if (validate && !validate(value)) {
      this.setState({ valid: false });
    } else {
      this.setState({ valid: true });
    }
  };

  render() {
    const {
      className,
      notEmpty,
      value,
      labelText,
      placeholder,
      onChange,

      editable,
      onEnableEdit
    } = this.props;
    const { valid, hover, showHint } = this.state;

    const styleClass = valid ? `valid` : `invalid`;

    if (editable) {
      return (
        <div className={`editable-label ${className}`}>
          <input
            ref="labelInput"
            type="text"
            value={value}
            className={styleClass}
            placeholder={placeholder}
            onChange={this.handleChange}
            onKeyPress={this.handleKeyPress}
            //onBlur={this.handleSubmit}
            autoFocus
            required={notEmpty}
          />
          {showHint && "hint"}
        </div>
      );
    } else {
      return (
        <div
          className={`editable-label ${className}`}
          onClick={onEnableEdit}
          onMouseEnter={() => this.setState({ hover: true })}
          onMouseLeave={() => this.setState({ hover: false })}
        >
          <span>
            {labelText}
          </span>
          {hover && <i className="material-icons">edit</i>}
        </div>
      );
    }
  }
}

TextLabel.defaultProps = defaultProps;
