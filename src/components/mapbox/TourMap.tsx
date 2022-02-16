import { Box } from "@mui/material";
import { lineString } from "@turf/turf";
import { useSelector } from "@xstate/react";
import React from "react";
import { FaMapMarkerAlt } from "react-icons/fa";
import Map, { Layer, Marker, Source } from "react-map-gl";
import { useMapboxCtx } from "~/contexts/MapboxCtx";
import { useTourCtx } from "~/contexts/TourCtx";
import { useLegs } from "~/hooks/useLegs";
import PoiMarkers from "./PoiMarkers";

import { getMyArcRoute } from "./tourmap.helper";
import AirportMarkers from "./AirportMarkers";

function TourMap() {
  const [viewState, setViewState] = React.useState({
    longitude: -100,
    latitude: 40,
    zoom: 3.5,
    pitch: 25,
    bearing: 0,
    padding: {
      top: 0,
      bottom: 0,
      left: 0,
      right: 0,
    },
  });
  const { mapService } = useMapboxCtx();
  const { legObj, orderedEvents } = useLegs();
  const { tourInfo } = useTourCtx();

  const mapAirports = useSelector(
    mapService,
    ({ context }) => context.mapAirports
  );

  const ctxMap = useSelector(mapService, ({ context }) => context.map);

  const selectedLegId = useSelector(
    mapService,
    ({ context }) => context.selectedLegId
  );
  const selectedEventId = useSelector(
    mapService,
    ({ context }) => context.selectedEventId
  );
  const selectedLegInfo = selectedLegId ? legObj[selectedLegId] : null;

  const events = selectedLegInfo
    ? selectedLegInfo.events
    : orderedEvents?.ordered;

  const eventSegments =
    events &&
    events
      .map((ev, i, arr) => {
        const thisEvent = ev;
        const nextEvent = arr[i + 1];
        if (!nextEvent) return null;
        const { lat: latA, lng: lngA } = thisEvent.loc;
        const { lat: latB, lng: lngB } = nextEvent.loc;
        return {
          from: [lngA, latA],
          to: [lngB, latB],
        };
      })
      .filter((a) => !!a);

  return (
    <div>
      <Map
        ref={(map) => {
          if (map && !ctxMap) {
            mapService.send({ type: "LOAD_MAP", payload: { map } });
          }
        }}
        {...viewState}
        onMove={(e) => setViewState(e.viewState)}
        mapboxAccessToken={process.env.NEXT_PUBLIC_MAPBOX_KEY!}
        style={{ width: "100%", height: 400 }}
        mapStyle="mapbox://styles/mapbox/light-v9"
      >
        {/* {eventSegments?.length &&
          eventSegments.map((seg, i) => {
            if (!seg) return null;
            const { from, to } = seg;
            const lineSeg = lineString([from, to]);
            return (
              <Source key={`line_${i}`} type="geojson" data={lineSeg}>
                <Layer type="line" id={`line${i}`} interactive />
              </Source>
            );
          })} */}
        {eventSegments?.length &&
          eventSegments.map((seg, i) => {
            if (!seg) return null;
            const { from, to } = seg;
            const lineSeg = lineString([from, to]);
            if (i === 0) {
              const myData = getMyArcRoute(from, to, 0.5);
              return (
                <Source key={`line_${i}`} type="geojson" data={myData}>
                  <Layer type="line" id={`line${i}`} interactive />
                </Source>
              );
            }
            return (
              <Source key={`line_${i}`} type="geojson" data={lineSeg}>
                <Layer type="line" id={`line${i}`} interactive />
              </Source>
            );
          })}

        {legObj &&
          Object.entries(legObj).map(([legId, leg]) => {
            const { events, color } = leg;
            const legSelected = legId === selectedLegId;
            return events?.map((event) => {
              const { lat, lng } = event.loc;
              const { event_id } = event;
              const eventSelected = event_id === selectedEventId;
              return (
                <Marker
                  key={event_id}
                  style={{ opacity: legSelected ? 1 : 0.3 }}
                  latitude={lat}
                  longitude={lng}
                  anchor="bottom"
                >
                  <Box
                    sx={{ position: "relative", bottom: -5, cursor: "pointer" }}
                    onClick={() => {
                      console.log("clicked", event);
                      mapService.send({
                        type: "TOGGLE_SELECTED_EVENT",
                        payload: {
                          event_id,
                          open: true,
                        },
                      });
                    }}
                  >
                    <FaMapMarkerAlt
                      style={{
                        width: 25,
                        height: 25,
                        color: color[500],
                        transition: "transform .5s",
                        transformOrigin: "bottom center",
                        transform: `scale(${eventSelected ? "1.5" : 0.8})`,
                      }}
                    />
                  </Box>
                </Marker>
              );
            });
          })}
        <PoiMarkers />
        <AirportMarkers />
      </Map>
      {/* {!!selectedEvent && <SelectedEventView />} */}
    </div>
  );
}

export default TourMap;
