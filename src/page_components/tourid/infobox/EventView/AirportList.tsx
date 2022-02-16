import { Box, Chip, Typography } from "@mui/material";
import { distance, point } from "@turf/turf";
import { useSelector } from "@xstate/react";
import { LngLat } from "react-map-gl";
import React, { useCallback, useEffect, useRef, useState } from "react";
import DataView from "~/components/DataView";
import { useMapboxCtx } from "~/contexts/MapboxCtx";
import { useFlightFxns } from "~/hooks/travel/useFlightFxns";
import { useMapBounds } from "~/hooks/useMapBounds";
import { rainbow } from "~/utils/mapBox/legColors";

const AirportList = () => {
  const { mapService } = useMapboxCtx();
  const { getAirportsWithinBounds } = useFlightFxns();
  const map = useSelector(mapService, ({ context }) => context.map);
  const mapBounds = useSelector(mapService, ({ context }) => context.mapBounds);
  const [selectedAirportId, setSelectedAirportId] = useState("");
  const listRef = useRef<HTMLUListElement>(null);
  const { isOnMap } = useMapBounds();
  const selectedEvent = useSelector(
    mapService,
    ({ context }) => context.selectedEvent
  );
  const mapAirports = useSelector(
    mapService,
    ({ context }) => context.mapAirports
  );

  const handleAirportsResponse = useCallback(
    ({ airports }: { airports: { [iata: string]: AirportPoi } }) => {
      mapService.send({ type: "UPDATE_AIRPORTS", payload: { airports } });
    },
    []
  );

  useEffect(() => {
    // remove airport icons when you click away
    return () => {
      mapService.send({
        type: "SHOW_HIDE_MARKERS",
        payload: { type: "airports", show: false },
      });
    };
  }, []);

  useEffect(() => {
    if (!map) return;
    const afterMoveCB = (e: any) => {
      const bounds = e.target.getBounds();
      getAirportsWithinBounds(bounds).then((resp) => {
        handleAirportsResponse(resp);
      });
    };
    // start listener
    map.on("moveend", afterMoveCB);
    // fetch on mount
    getAirportsWithinBounds(map.getBounds()).then((resp) => {
      handleAirportsResponse(resp);
    });
    // stop listener
    return () => {
      map.off("moveend", afterMoveCB);
    };
  }, [map, handleAirportsResponse]);

  const getDistanceFromEvent = useCallback(
    ({ lat, lng }: { lat: number; lng: number }) => {
      if (!selectedEvent) return 0;
      const {
        loc: { lat: evtLat, lng: evtLng },
      } = selectedEvent;
      const eventPoint = point([evtLng, evtLat]);
      const airportPoint = point([lng, lat]);
      return distance(eventPoint, airportPoint, { units: "miles" });
    },
    [selectedEvent]
  );
  const handleClickAP = (iata: string) => {
    setSelectedAirportId(iata);
    const selectedAP = mapAirports?.airports[iata];
    if (!selectedEvent || !selectedAP) {
      console.log(`missing`, { selectedAP, selectedEvent });
      return;
    }
    const point1 = selectedAP;
    const point2 = selectedEvent.loc;

    mapService.send({
      type: "FOCUS_TWO_POINTS",
      payload: { point1, point2 },
    });
  };
  const selectedAP =
    selectedAirportId && mapAirports?.airports[selectedAirportId];
  return (
    <div>
      <Box
        sx={{ border: 1, width: "100%", height: 200, overflow: "scroll" }}
        ref={listRef}
      >
        <Box sx={{ width: "100%", overflow: "scroll" }}>
          <Box sx={{ display: "flex", flexWrap: "nowrap" }}>
            {mapAirports?.airports &&
              mapAirports.show &&
              Object.values(mapAirports.airports)
                .filter(isOnMap)
                .sort((a, b) => b.links_count - a.links_count)
                .map((ap, index) => {
                  const isSelected = ap.iata_code === selectedAirportId;
                  const distanceInMiles = getDistanceFromEvent(ap);
                  return (
                    <Box sx={{ mr: 1, textAlign: "center" }}>
                      <Chip
                        variant={isSelected ? "filled" : "outlined"}
                        key={ap.iata_code}
                        label={ap.name}
                        clickable
                        onClick={() => handleClickAP(ap.iata_code)}
                      />
                      <Typography
                        variant="caption"
                        color="GrayText"
                        component="div"
                      >
                        {Math.round(distanceInMiles)} mi.
                      </Typography>
                    </Box>
                  );
                })}
          </Box>
        </Box>
        <Box>
          <pre>{JSON.stringify(selectedAP, null, 2)}</pre>
        </Box>
      </Box>
      <DataView data={mapAirports} title="mapAirports" />
    </div>
  );
};

export default AirportList;
