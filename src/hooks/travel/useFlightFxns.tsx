import axios from "axios";
import type { LngLatBounds } from "mapbox-gl";
import { polygon } from "@turf/turf";

export const useFlightFxns = () => {
  const getAirportsNear = async ({
    lat,
    lng,
    km,
  }: {
    lat: number;
    lng: number;
    km?: number;
  }) => {
    const response = await axios.post("/api/airports?type=distance", {
      lat,
      lng,
      km,
    });
    console.log("response", response.data);
  };

  const getAirportsWithinBounds = async (
    bounds: LngLatBounds
  ): Promise<{ airports: { [iata_code: string]: AirportPoi } }> => {
    const ne = bounds.getNorthEast();
    const nw = bounds.getNorthWest();
    const se = bounds.getSouthEast();
    const sw = bounds.getSouthWest();
    console.log("bounds", bounds);
    console.log({ ne, nw, se, sw });
    return axios
      .post("/api/airports?type=bounds", {
        ne,
        nw,
        se,
        sw,
      })
      .then((res) => {
        console.log("response", res.data);
        return res.data;
      });
  };

  return { getAirportsNear, getAirportsWithinBounds };
};
