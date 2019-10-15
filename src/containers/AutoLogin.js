import React, { Component } from "react";
import { Redirect } from "react-router-dom";
import axios from "axios";

import Loader from "../components/Loader.js";
import SecurityContext from "../lib/SecurityContext.js";

class AutoLogin extends Component {
  static contextType = SecurityContext;

  constructor(props) {
    super(props);

    this.state = {
      loading: true,
      error: null,
    };
  }

  async getAccessToken() {
    try {
      const response = await axios.get("/.netlify/functions/passwordAuthentication");

      if (response.data) {
        const { data } = response;

        if (data.error) {
          await this.setState({
            error: data.error,
            loading: false,
          });
        } else {
          const { expires_in } = data;
          const expiresAt = new Date(+new Date() + expires_in * 1000);

          await this.setState(
            {
              error: false,
              loading: false,
              tokens: data.tokens,
              expiresIn: expires_in,
              expiresAt,
            },
            () => {
              const { tokens, expiresIn, expiresAt } = this.state;
              this.context.updateContext({
                tokens,
                expiresIn,
                expiresAt,
              });
            }
          );
        }
      }
    } catch (error) {
      await this.setState({
        error: error.message,
        loading: false,
      });
    }
  }

  async componentDidMount() {
    await this.getAccessToken();
  }

  render() {
    const { loading, error, tokens } = this.state;

    if (loading) {
      return <Loader />;
    } else if (error) {
      return <div>Error: {error}</div>;
    } else if (tokens) {
      return <Redirect to="/" />;
    } else {
      throw new Error("Unexpected login state");
    }
  }
}

export default AutoLogin;
