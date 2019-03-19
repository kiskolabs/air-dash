const axios = require("axios");
const encryptor = require("simple-encryptor")(process.env.ENCRYPTION_KEY);

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

    let data = response.data;
    if (data.access_token) {
      data.access_token = encryptor.encrypt(data.access_token);
    }
    if (data.refresh_token) {
      data.refresh_token = encryptor.encrypt(data.refresh_token);
    }

    return {
      statusCode: response.status,
      body: JSON.stringify(data),
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
