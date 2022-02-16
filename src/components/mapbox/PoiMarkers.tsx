import { useSelector } from "@xstate/react";
import React from "react";
import { Marker } from "react-map-gl";
import { useMapboxCtx } from "~/contexts/MapboxCtx";
import DataView from "~/components/DataView";
import { legColors } from "~/utils/mapBox/legColors";
import NextImage from "next/image";
import { Box } from "@mui/material";
import { blueGrey } from "@mui/material/colors";
import MyPin2 from "../../page_components/tourid/MyPin2";

const iconSize = 20;

const PoiMarkers = () => {
  const { mapService } = useMapboxCtx();
  const myPois = useSelector(mapService, ({ context }) => {
    const { selectedEventId, poiQueries } = context;
    const _myPois =
      poiQueries && selectedEventId ? poiQueries[selectedEventId] : null;
    return _myPois;
  });
  const event = useSelector(mapService, ({ context }) => context.selectedEvent);
  const lat = event?.loc.lat;
  const lng = event?.loc.lng;
  return (
    <div>
      {myPois &&
        Object.entries(myPois).map(([queryString, poi]) => {
          const { show, results } = poi;
          if (!show) return null;
          return results.map((result) => {
            const { icon, icon_background_color } = result;
            const lat = result.geometry?.location?.lat;
            const lng = result.geometry?.location?.lng;
            return lat && lng ? (
              <Marker latitude={lat()} longitude={lng()} anchor="bottom">
                <Box
                  sx={{
                    width: 25,
                    height: 25,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    position: "relative",
                  }}
                >
                  <MyPin2 color1={blueGrey[400]} color2={blueGrey[200]} />
                  {icon && (
                    <Box
                      sx={{
                        position: "absolute",
                        width: 15,
                        height: 15,
                        top: 4,
                        cursor: "pointer",
                      }}
                      onClick={() => {
                        console.log("clicked", result);
                      }}
                    >
                      <NextImage src={icon} width={15} height={15} />
                    </Box>
                  )}
                </Box>
              </Marker>
            ) : null;
          });
        })}
    </div>
  );
};

export default PoiMarkers;
