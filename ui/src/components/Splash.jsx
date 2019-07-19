import React from "react";
import { Redirect } from "react-router-dom";

class Splash extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      isLoading: true
    };
  }

  componentDidMount() {
    setTimeout(() => this.setState({ isLoading: false }), 1000);
  }

  render() {
    const { isLoading } = this.state;

    if (isLoading) {
      return <div className="full-screen" />;
    }

    return <Redirect to="/create-loan" />;
  }
}

export default Splash;
