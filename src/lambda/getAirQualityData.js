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
    let params = event.queryStringParameters;

    if (!params.tokens) {
      throw "No tokens";
    }

    const unsealed = await Iron.unseal(params.tokens, password, Iron.defaults);
    delete params.tokens;

    params.access_token = unsealed.access_token;

    const response = await axios.request({
      url: "https://api.netatmo.com/api/gethomecoachsdata",
      method: "post",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      params: params,
    });

    let data = response.data;
    if (data.body && data.body.user) {
      delete data.body.user;
    }

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
