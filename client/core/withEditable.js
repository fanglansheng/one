import React from "react";
import PropTypes from "prop-types";

export default function withEditable(WrappedComponent) {
  return class extends React.Component {
    static propTypes = {
      onSubmit: PropTypes.func.isRequired
    };
    constructor(props) {
      super(props);
      this.state = {
        editable: false
      };
    }

    handleEnableEdit = e => {
      this.setState({ editable: true });
    };

    handleDisableEditAndSubmit = e => {
      this.setState({ editable: false });
      this.props.onSubmit(e);
    };

    render() {
      return (
        <WrappedComponent
          {...this.props}
          editable={this.state.editable}
          onEnableEdit={this.handleEnableEdit}
          onDisableEditAndSubmit={this.handleDisableEditAndSubmit}
        />
      );
    }
  };
}
