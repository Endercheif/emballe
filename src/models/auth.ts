import type Reddit from "../index";

import axios, { AxiosRequestConfig } from "axios";
import btoa from "btoa";

class Auth {
  reddit: Reddit;
  params: AuthParams;
  constructor(reddit: Reddit, params: AuthParams) {
    this.reddit = reddit;
    this.params = params;
  }

  async authorize() {
    const params = {
      username: this.params.username,
      password: this.params.password,
      grant_type: "password",
    };

    const config: AxiosRequestConfig = {
      method: "post",
      url: "https://www.reddit.com/api/v1/access_token/",
      headers: {
        "user-agent": this.params.userAgent || "Reddit Bot",
        "Authorization":
          "Basic " +
          btoa(`${this.params.clientID}:${this.params.clientSecret}`),
      },
      params: params,
    };

    return await axios(config);
  }
}

export default Auth;
