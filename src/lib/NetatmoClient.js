import axios from "axios";

const DATE_KEYS = [
  "date_max_temp",
  "time_utc",
  "date_min_temp",
  "time_server",
  "last_status_store",
  "date_setup",
  "last_upgrade",
  "last_setup",
];

function convertUnixTimesToDates(object) {
  for (let key of Object.keys(object)) {
    if (object.hasOwnProperty(key)) {
      const value = object[key];
      if (DATE_KEYS.includes(key) && typeof value === "number") {
        object[key] = new Date(value * 1000);
      } else if (typeof value === "object") {
        object[key] = convertUnixTimesToDates(value);
      }
    }
  }

  return object;
}

class NetatmoClient {
  constructor(accessToken) {
    this.accessToken = accessToken;
  }

  async getAirQualityData() {
    const fetchLabel = "Fetching air quality data";
    const processingLabel = "Processing air quality data";

    console.time(fetchLabel);
    const response = await axios.get("https://api.netatmo.com/api/gethomecoachsdata", {
      params: { access_token: this.accessToken },
    });
    console.timeEnd(fetchLabel);

    let { data } = response;

    console.time(processingLabel);
    const processedData = convertUnixTimesToDates(data);
    console.timeEnd(processingLabel);

    return processedData;
  }
}

export default NetatmoClient;
