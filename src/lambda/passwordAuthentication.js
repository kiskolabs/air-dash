const axios = require("axios");

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

    return {
      statusCode: 200,
      body: JSON.stringify(response.data),
    };
  } catch (error) {
    if (error.response) {
      console.error(error.response.data);
    } else {
      console.error(error);
    }

    const {
      response: { data },
    } = error;

    return {
      statusCode: error.response.status,
      body: JSON.stringify({ error: `${error.message} (${data.error})` }),
    };
  }
}
