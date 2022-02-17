import { useSelector } from "@xstate/react";
import React from "react";
import { Marker } from "react-map-gl";
import { useMapboxCtx } from "~/contexts/MapboxCtx";
import { MdLocalAirport } from "react-icons/md";
import { Box, Tooltip } from "@mui/material";
import { useMapBounds } from "~/hooks/useMapBounds";
import { motion } from "framer-motion";

const AirportMarkers = () => {
  const { mapService } = useMapboxCtx();

  const mapAirports = useSelector(
    mapService,
    ({ context }) => context.mapAirports
  );
  const selectedAirportId = useSelector(
    mapService,
    ({ context }) => context.selectedAirportId
  );

  const handleClickAirport = (iata_code: string, isSelected?: boolean) => {
    mapService.send({
      type: "SELECT_AIRPORT",
      payload: { iata_code, selected: !isSelected },
    });
  };

  const { isOnMap } = useMapBounds();
  return (
    <>
      {mapAirports?.airports &&
        mapAirports.show &&
        Object.values(mapAirports.airports)
          .filter(isOnMap)
          .map((ap) => {
            const { lat, lng } = ap;
            const isSelected = ap.iata_code === selectedAirportId;
            return (
              <Marker
                key={ap.iata_code}
                latitude={lat}
                longitude={lng}
                anchor="center"
              >
                <Tooltip title={ap.name}>
                  <Box
                    sx={{
                      width: 20,
                      height: 20,
                      cursor: "pointer",
                      position: "relative",
                    }}
                    onClick={() => {
                      handleClickAirport(ap.iata_code, isSelected);
                    }}
                  >
                    {isSelected && <MarkerCircle />}
                    <MdLocalAirport
                      style={{
                        height: 20,
                        width: 20,
                        position: "absolute",
                        top: 0,
                        color: isSelected ? "blue" : "gray",
                      }}
                    />
                  </Box>
                </Tooltip>
              </Marker>
            );
          })}
    </>
  );
};

export default AirportMarkers;

const MoBox = motion(Box);

const MarkerCircle = () => {
  return (
    <MoBox
      variants={{
        small: {
          scale: 1.2,
        },
        large: {
          scale: 1.5,
          transition: { repeat: Infinity, duration: 1, repeatType: "reverse" },
        },
      }}
      style={{
        height: 20,
        width: 20,
        position: "absolute",
        border: "1px solid black",
        borderRadius: "50%",
        transform: "translate(-15px,-15px)",
      }}
      initial="small"
      animate={"large"}
    />
  );
};
