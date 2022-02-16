import type { NextApiRequest, NextApiResponse } from "next";
import { airports } from "./airportsByLinks";
import {
  distance,
  bbox,
  lineString,
  booleanWithin,
  point,
  polygon,
} from "@turf/turf";
import type { LngLat } from "mapbox-gl";
import boundsI from "./bounds";

type AirportListItem = {
  name: string;
  city: string;
  country: string;
  iata_code: string;
  _geoloc: {
    lat: number;
    lng: number;
  };
  links_count: number;
  objectID: string;
};

const convertListItemToRecord = (
  listItem: AirportListItem,
  distanceKm?: number
): AirportRecord => {
  const { _geoloc, ...airportInfo } = listItem;
  const { lat, lng } = _geoloc!;
  return {
    ...airportInfo,
    lat,
    lng,
    distanceKm,
    type: "airport",
  };
};

const getAirportsWithin = (center: number[], km: number) => {
  const airportsInRange: { [id: string]: AirportRecord } = {};
  //@ts-ignore
  airports.forEach((ap: AirportListItem) => {
    const { _geoloc, ...airportInfo } = ap;
    const { lat, lng } = _geoloc!;
    const distanceKm = distance(center, [lng, lat], {
      units: "kilometers",
    });
    if (distanceKm <= km) {
      const _airportRecord = convertListItemToRecord(ap, distanceKm);
      airportsInRange[ap.iata_code] = _airportRecord;
    }
  });
  return airportsInRange;
};

const getAirportsInBox = ({
  ne,
  nw,
  se,
  sw,
}: {
  ne: LngLat;
  nw: LngLat;
  se: LngLat;
  sw: LngLat;
}) => {
  const boundingBox = polygon([
    [
      [ne.lng, ne.lat],
      [nw.lng, nw.lat],
      [sw.lng, sw.lat],
      [se.lng, se.lat],
      [ne.lng, ne.lat],
    ],
  ]);
  const _airports: { [ap_id: string]: AirportRecord } = {};
  airports.forEach((ap: AirportListItem) => {
    const { _geoloc, ...airportInfo } = ap;
    const { lat, lng } = _geoloc!;
    const airportPoint = point([lng, lat]);
    const isWithin = booleanWithin(airportPoint, boundingBox);
    if (isWithin) {
      const _airportRecord = convertListItemToRecord(ap);
      _airports[ap.iata_code] = _airportRecord;
    }
  });
  return _airports;
};

export default async (req: NextApiRequest, res: NextApiResponse) => {
  switch (req.query.type) {
    case "bounds": {
      try {
        const { ne, nw, se, sw } = req.body;
        const airports = getAirportsInBox({ ne, nw, se, sw });
        return res.status(200).json({ airports });
      } catch (error) {
        console.log("error", error);
        return res.status(400).json({ error: "bounds didnt work" });
      }
    }
    case "distance": {
      const { lat, lng, km = 250 } = req.body;
      if (!lat || !lng) return res.status(400).send("must send lat lng ");
      const airportsInRange = getAirportsWithin([lng, lat], km);
      return res.status(200).json({ airports: airportsInRange });
    }
  }
  return res.status(200).json({ error: "send a type" });
};
