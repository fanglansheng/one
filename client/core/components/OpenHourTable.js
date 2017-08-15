import React from "react";
import PropTypes from "prop-types";
import "./OpenHourTableStyle.scss";

const defaultProps = {
  className: "",
  inputType: "text",
  placeholder: "click to edit",
  autoFocus: false
};

export default class OpenHourTable extends React.Component {
  static propTypes = {
    openNow: PropTypes.bool.isRequired,
    weekdayText: PropTypes.array.isRequired
  };

  constructor(props) {
    super(props);
    this.state = {
      expand: false
    };
  }

  toggleExpand = () => {
    this.setState({ expand: !this.state.expand });
  };

  render() {
    const { expand } = this.state;
    const { openNow, weekdayText } = this.props;
    return (
      <div className="open-hour-table">
        <p className="place-info-entry">
          <i className="fa fa-clock-o" />
          <a onClick={this.toggleExpand}>
            Opening hours: {openNow ? "Open Now" : "Closed"}
          </a>
        </p>
        {expand &&
          <table>
            <tbody>
              {weekdayText.map((text, index) => {
                const time = text.split(": ");
                return (
                  <tr key={index}>
                    <th>
                      {time[0]}
                    </th>
                    <td>
                      {time[1]}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>}
      </div>
    );
  }
}
