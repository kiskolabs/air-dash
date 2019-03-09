const axios = require("axios");

const formUrlEncoded = x =>
  Object.keys(x)
    .reduce((p, c) => p + `&${c}=${encodeURIComponent(x[c])}`, "")
    .substr(1);

export async function handler(event, context) {
  try {
    const response = await axios.request({
      url: "https://api.netatmo.com/oauth2/token",
      method: "post",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      data: formUrlEncoded({
        grant_type: "authorization_code",
        client_id: process.env.NETATMO_CLIENT_ID,
        client_secret: process.env.NETATMO_CLIENT_SECRET,
        code: event.queryStringParameters.code,
        redirect_uri: event.queryStringParameters.redirect_uri,
        scope: "read_homecoach",
      }),
    });

    return {
      statusCode: 200,
      body: JSON.stringify(response.data),
    };
  } catch (error) {
    console.error(error.response.data);

    const {
      response: { data },
    } = error;

    return {
      statusCode: error.response.status,
      body: JSON.stringify({ error: `${error.message} (${data.error})` }),
    };
  }
}
