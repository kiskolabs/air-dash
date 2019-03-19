const axios = require("axios");
const encryptor = require("simple-encryptor")(process.env.ENCRYPTION_KEY);

function formUrlEncoded(x) {
  return Object.keys(x)
    .reduce((p, c) => p + `&${c}=${encodeURIComponent(x[c])}`, "")
    .substr(1);
}

export async function handler(event, context) {
  try {
    let params = event.queryStringParameters;
    params["access_token"] = encryptor.decrypt(params["access_token"]);

    const response = await axios.request({
      url: "https://api.netatmo.com/api/getmeasure",
      method: "post",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      params: params,
    });

    return {
      statusCode: response.status,
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
