const axios = require("axios");

function formUrlEncoded(x) {
  return Object.keys(x)
    .reduce((p, c) => p + `&${c}=${encodeURIComponent(x[c])}`, "")
    .substr(1);
}

export async function handler(event, context) {
  try {
    console.log(event.queryStringParameters);
    const response = await axios.request({
      url: "https://api.netatmo.com/oauth2/token",
      method: "post",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      data: formUrlEncoded({
        grant_type: "refresh_token",
        refresh_token: event.queryStringParameters.refresh_token,
        client_id: process.env.NETATMO_CLIENT_ID,
        client_secret: process.env.NETATMO_CLIENT_SECRET,
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
