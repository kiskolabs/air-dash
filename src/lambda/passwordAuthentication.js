const axios = require("axios");
const Iron = require("@hapi/iron");

const password = process.env.ENCRYPTION_KEY;

function formUrlEncoded(x) {
  return Object.keys(x)
    .reduce((p, c) => p + `&${c}=${encodeURIComponent(x[c])}`, "")
    .substr(1);
}

export async function handler(event, context) {
  try {
    const response = await axios.request({
      url: "https://api.netatmo.com/oauth2/token",
      method: "post",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      data: formUrlEncoded({
        grant_type: "password",
        client_id: process.env.NETATMO_CLIENT_ID,
        client_secret: process.env.NETATMO_CLIENT_SECRET,
        username: process.env.NETATMO_USERNAME,
        password: process.env.NETATMO_PASSWORD,
        scope: "read_homecoach",
      }),
    });

    let tokens = {};
    let data = response.data;
    if (data.access_token) {
      tokens.access_token = data.access_token;
      delete data.access_token;
    }
    if (data.refresh_token) {
      tokens.refresh_token = data.refresh_token;
      delete data.refresh_token;
    }

    data.tokens = await Iron.seal(tokens, password, Iron.defaults);

    return {
      statusCode: response.status,
      body: JSON.stringify(data),
    };
  } catch (error) {
    if (error.response) {
      console.error(error.response.data);

      const {
        response: { data },
      } = error;
    } else {
      console.log(error.message);
    }

    return {
      statusCode: error.response ? error.response.status : 500,
      body: JSON.stringify({ error: `${error.message} (${data.error})` }),
    };
  }
}
