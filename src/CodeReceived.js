import React, { Component } from "react";
import { Redirect } from "react-router-dom";
import axios from "axios";

import SecurityContext from "./SecurityContext.js";

class CodeReceived extends Component {
  static contextType = SecurityContext;

  constructor(props) {
    super(props);

    const params = new URLSearchParams(window.location.search);

    this.state = {
      code: params.get("code"),
      state: params.get("state"),
      loading: true,
      error: false,
    };

    this.getAccessToken = this.getAccessToken.bind(this);
  }

  async getAccessToken() {
    try {
      const response = await axios.get("/.netlify/functions/getAccessToken", {
        params: {
          code: this.state.code,
          redirect_uri: `${window.location.origin}/code-received/`,
        },
      });

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
              accessToken: data.access_token,
              refreshToken: data.refresh_token,
              expiresIn: expires_in,
              expiresAt,
            },
            () => {
              const { accessToken, refreshToken, expiresIn, expiresAt } = this.state;
              this.context.updateContext({
                accessToken,
                refreshToken,
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
    const { loading, error, accessToken } = this.state;

    if (loading) {
      return <div>Loading…</div>;
    } else if (error) {
      return <div>Error: {error}</div>;
    } else if (accessToken) {
      return <Redirect to="/" />;
    }

    return <div>CodeReceived</div>;
  }
}

export default CodeReceived;
