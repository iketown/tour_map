import axios from "axios";
import type { AxiosRequestConfig } from "axios";
export const getTimeZone = async ({
  lat,
  lng,
  timestamp,
}: {
  lat: number;
  lng: number;
  timestamp?: number;
}) => {
  const _timestamp = timestamp || new Date().valueOf() / 1000;
  var config: AxiosRequestConfig = {
    method: "get",
    url: `https://maps.googleapis.com/maps/api/timezone/json?location=${lat},${lng}&timestamp=${_timestamp}&key=${process.env.NEXT_PUBLIC_GOOGLE_PLACES_KEY}`,
    headers: {},
  };

  return axios(config)
    .then(function (response) {
      return response.data;
    })
    .catch(function (error) {
      console.log(error);
    });
};

// https://maps.googleapis.com/maps/api/timezone/json?location=39.6034810,-119.6822510&timestamp=1331161200&key=YOUR_API_KEY
