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
  try {
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
  } catch (e) {
    console.error(e);
  }

  return object;
}

class NetatmoClient {
  async getAirQualityData(tokens) {
    const fetchLabel = "Fetching air quality data";
    const processingLabel = "Processing air quality data";

    console.time(fetchLabel);
    const response = await axios.get("/.netlify/functions/getAirQualityData", {
      params: { tokens },
    });
    console.timeEnd(fetchLabel);

    let { data } = response;

    console.time(processingLabel);
    const processedData = convertUnixTimesToDates(data);
    console.timeEnd(processingLabel);

    return processedData;
  }

  async getMeasurements(tokens, options) {
    const fetchLabel = `Fetching measurements (${options.deviceId})`;
    const processingLabel = `Processing air quality data (${options.deviceId})`;
    console.time(fetchLabel);

    const response = await axios.get("/.netlify/functions/getMeasurements", {
      params: {
        tokens: tokens,
        date_begin: options.dateBegin,
        date_end: options.dateEnd,
        device_id: options.deviceId,
        limit: options.limit,
        optimize: !!options.optimize,
        real_time: !!options.realTime,
        scale: options.scale || "max",
        type: options.type || "CO2,Humidity,Noise,Temperature",
      },
    });
    console.timeEnd(fetchLabel);

    let { data } = response;

    console.time(processingLabel);
    const processedData = convertUnixTimesToDates(data);
    console.timeEnd(processingLabel);

    return processedData;
  }

  // < 15°: red
  // 15° - 16°: orange
  // 16° - 17°: yellow
  // 17° - 18°: blue
  // 18° - 23°: green
  // 23° - 26°: blue
  // 26° - 27°: yellow
  // 27° - 29°: orange
  // >29°: red
  temperatureToColor(celsius) {
    if (celsius < 15) {
      return "red";
    } else if (celsius >= 15 && celsius < 16) {
      return "orange";
    } else if (celsius >= 16 && celsius < 17) {
      return "yellow";
    } else if (celsius >= 17 && celsius < 18) {
      return "blue";
    } else if (celsius >= 18 && celsius < 23) {
      return "green";
    } else if (celsius >= 23 && celsius < 26) {
      return "blue";
    } else if (celsius >= 26 && celsius < 27) {
      return "yellow";
    } else if (celsius >= 27 && celsius < 20) {
      return "orange";
    } else {
      return "red";
    }
  }

  // < 50dB: green
  // 50dB - 65db: blue
  // 65db - 70dB: yellow
  // 70db - 80db orange
  // >80db: red
  noiseToColor(dba) {
    if (dba < 50) {
      return "green";
    } else if (dba >= 15 && dba < 65) {
      return "blue";
    } else if (dba >= 65 && dba < 70) {
      return "yellow";
    } else if (dba >= 70 && dba < 80) {
      return "orange";
    } else {
      return "red";
    }
  }

  // < 900ppm: green
  // 900ppm - 1150ppm: blue
  // 1150ppm - 1400ppm: yellow
  // 1400ppm - 1600ppm: orange
  // > 1600ppm: red
  co2ToColor(ppm) {
    if (ppm < 900) {
      return "green";
    } else if (ppm >= 900 && ppm < 1150) {
      return "blue";
    } else if (ppm >= 1150 && ppm < 1400) {
      return "yellow";
    } else if (ppm >= 1400 && ppm < 1600) {
      return "orange";
    } else {
      return "red";
    }
  }

  // < 15%: red
  // 15% - 20%: orange
  // 20% - 30%: yellow
  // 30% - 40%: blue
  // 40% - 50%: green
  // 50% - 60%: blue
  // 60% - 70%: yellow
  // 70% - 80%: orange
  // >80%: red
  humidityToColor(percent) {
    if (percent < 15) {
      return "red";
    } else if (percent >= 15 && percent < 20) {
      return "orange";
    } else if (percent >= 20 && percent < 30) {
      return "yellow";
    } else if (percent >= 30 && percent < 40) {
      return "blue";
    } else if (percent >= 40 && percent < 50) {
      return "green";
    } else if (percent >= 50 && percent < 60) {
      return "blue";
    } else if (percent >= 60 && percent < 70) {
      return "yellow";
    } else if (percent >= 70 && percent < 80) {
      return "orange";
    } else {
      return "red";
    }
  }

  // 0: green
  // 1: blue
  // 2: yellow
  // 3: orange
  // 4: red
  healthIndexToColor(index) {
    return ["green", "blue", "yellow", "orange", "red"][index];
  }

  healthIndexToWords(index) {
    return ["Healthy", "Fine", "Fair", "Poor", "Unhealthy"][index];
  }
}

export default NetatmoClient;
