import React from "react";
import $ from "jquery";

class CheckClick extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isToggleOn: true,
      style: "display:none",
    };

    this.handleClick = this.handleClick.bind(this);
  }

  handleClick(e) {
    if ($(e.target).is("li")) {
      return;
    } else {
      this.setState({ isToggleOn: false });
    }

    const { isToggleOn } = this.state;
    if (!isToggleOn) {
      $(".scrollable-menu").attr("style", "display:none");
    }
  }

  componentDidMount() {
    window.addEventListener("click", this.handleClick);
  }

  componentWillUnmount() {
    window.removeEventListener("click", this.handleClick);
  }

  render() {
    return <div></div>;
  }
}

export default CheckClick;
