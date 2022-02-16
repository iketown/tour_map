import { useSelector } from "@xstate/react";
import React from "react";
import { Marker } from "react-map-gl";
import { useMapboxCtx } from "~/contexts/MapboxCtx";
import { MdLocalAirport } from "react-icons/md";
import { Box, Tooltip } from "@mui/material";
import { useMapBounds } from "~/hooks/useMapBounds";

const AirportMarkers = () => {
  const { mapService } = useMapboxCtx();

  const mapAirports = useSelector(
    mapService,
    ({ context }) => context.mapAirports
  );
  const map = useSelector(mapService, ({ context }) => context.map);
  const { isOnMap } = useMapBounds();
  return (
    <>
      {mapAirports?.airports &&
        mapAirports.show &&
        Object.values(mapAirports.airports)
          .filter(isOnMap)
          .map((ap) => {
            const { lat, lng } = ap;
            return (
              <Marker
                key={ap.iata_code}
                latitude={lat}
                longitude={lng}
                anchor="center"
              >
                <Tooltip title={ap.name}>
                  <Box
                    sx={{ width: 20, height: 20, cursor: "pointer" }}
                    onClick={() => {
                      console.log("airport", ap);
                    }}
                  >
                    <MdLocalAirport style={{ height: 20, width: 20 }} />
                  </Box>
                </Tooltip>
              </Marker>
            );
          })}
    </>
  );
};

export default AirportMarkers;
