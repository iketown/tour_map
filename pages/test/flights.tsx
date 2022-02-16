import React from "react";
import Layout from "~/layout/Layout";
import { Button } from "@mui/material";
import { distance, point } from "@turf/turf";
import axios from "axios";

const atl = {
  name: "Hartsfield Jackson Atlanta Intl",
  city: "Atlanta",
  country: "United States",
  iata_code: "ATL",
  _geoloc: {
    lat: 33.636719,
    lng: -84.428067,
  },
  links_count: 1826,
  objectID: "3682",
};
const ord = {
  name: "Chicago Ohare Intl",
  city: "Chicago",
  country: "United States",
  iata_code: "ORD",
  _geoloc: {
    lat: 41.978603,
    lng: -87.904842,
  },
  links_count: 1108,
  objectID: "3830",
};

const lax = {
  name: "Los Angeles Intl",
  city: "Los Angeles",
  country: "United States",
  iata_code: "LAX",
  _geoloc: {
    lat: 33.942536,
    lng: -118.408075,
  },
  links_count: 990,
  objectID: "3484",
};

const FlightTest = () => {
  const getAirportsWithin = async ({
    lat,
    lng,
    km,
  }: {
    lat: number;
    lng: number;
    km: number;
  }) => {
    const response = await axios.post("/api/airports", { lat, lng, km });
    console.log("response", response.data);
  };
  return (
    <>
      <Layout>
        {[atl, ord, lax].map((ap) => {
          const handleClick = () => {
            const {
              _geoloc: { lat, lng },
            } = ap;
            getAirportsWithin({ lng, lat, km: 250 });
          };
          return (
            <Button onClick={handleClick}>
              get airports from {ap.iata_code}{" "}
            </Button>
          );
        })}
      </Layout>
    </>
  );
};

export default FlightTest;
