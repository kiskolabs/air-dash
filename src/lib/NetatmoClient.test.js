import { afterEach, describe, expect, it, vi } from "vitest";
import axios from "axios";

import NetatmoClient from "./NetatmoClient";

vi.mock("axios");

describe("NetatmoClient", () => {
  const client = new NetatmoClient();

  afterEach(() => {
    vi.clearAllMocks();
  });

  it("throws when the API payload includes an error", async () => {
    axios.get.mockResolvedValue({ data: { error: "Refresh failure: invalid_grant" } });

    await expect(client.getAirQualityData()).rejects.toThrow("Refresh failure: invalid_grant");
    expect(axios.get).toHaveBeenCalledWith(
      expect.stringContaining("/air_quality_data"),
      expect.objectContaining({ timeout: 15000 })
    );
  });

  it("maps temperature bands with the documented thresholds", () => {
    expect(client.temperatureToColor(27.5)).toBe("orange");
    expect(client.temperatureToColor(30)).toBe("red");
  });

  it("maps noise bands with the documented thresholds", () => {
    expect(client.noiseToColor(55)).toBe("blue");
    expect(client.noiseToColor(40)).toBe("green");
  });
});
