import { useMapboxCtx } from "~/contexts/MapboxCtx";
import dynamic from "next/dynamic";
import axios from "axios";
import { useSelector } from "@xstate/react";
import { useEffect, useState } from "react";

// `https://api.mapbox.com/directions/v5/mapbox/driving/-84.518641,39.134270;-84.512023,39.102779?geometries=geojson&access_token=${process
// .env.NEXT_PUBLIC_MAPBOX_KEY!}`;

const url = (locs: { lat: number; lng: number }[]) =>
  `https://api.mapbox.com/directions/v5/mapbox/driving/${locs
    .map((loc) => `${loc.lng},${loc.lat}`)
    .join(";")}?geometries=geojson&overview=full&access_token=${process.env
    .NEXT_PUBLIC_MAPBOX_KEY!}`;

export const useMapDirections = () => {
  const { mapService } = useMapboxCtx();
  const [isClient, setIsClient] = useState(false);
  const getDirections = async (locs: { lat: number; lng: number }[]) => {
    axios.get(url(locs)).then((res) => {
      console.log("directions", res.data);
    });
  };
  return { getDirections };
};
