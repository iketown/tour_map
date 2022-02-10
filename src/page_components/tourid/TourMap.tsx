import React, { useEffect, useRef, useMemo } from "react";
import { bbox, lineString, bezier } from "@turf/turf";
import Map, { Marker, Source, Layer } from "react-map-gl";
import type { MapRef, LineLayer } from "react-map-gl";
import { useMapboxCtx } from "~/contexts/MapboxCtx";
import { useLegs } from "~/hooks/useLegs";
import { Box } from "@mui/material";

import DataView from "../../components/DataView";
import Pin from "./Pin";
import MapMarker2 from "./MapMarker2";
import { getMyArcRoute } from "./tourmap.helper";
import { FaMapMarkerAlt, FaMapMarker } from "react-icons/fa";

function TourMap() {
  const mapRef = useRef<MapRef>(null);
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
  const { selectedLeg } = useMapboxCtx();
  const { legObj, orderedEvents } = useLegs();
  const selectedLegInfo = selectedLeg ? legObj[selectedLeg] : null;
  const events = selectedLegInfo
    ? selectedLegInfo.events
    : orderedEvents?.ordered;

  const line = useMemo(() => {
    return (
      events &&
      events.length > 1 &&
      lineString(
        events.map((ev) => {
          const { lat, lng } = ev.loc;
          return [lng, lat];
        })
      )
    );
  }, [events]);

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

  useEffect(() => {
    if (!line) return;
    console.log({ line });
    const [minLng, minLat, maxLng, maxLat] = bbox(line);
    mapRef.current?.fitBounds(
      [
        [minLng, minLat],
        [maxLng, maxLat],
      ],
      { padding: 40, duration: 1000, maxZoom: 7 }
    );
  }, [line]);

  useEffect(() => {
    // single event
    if (!events || events?.length !== 1) return;
    const oneEvent = events[0];
    console.log({ oneEvent });
    const { lat, lng } = oneEvent.loc;
    console.log;
    mapRef.current?.flyTo({
      center: [lng, lat],
      duration: 1000,
      zoom: 7,
    });
    // setViewState((old) => ({
    //   ...old,
    //   longitude: lng,
    //   latitude: lat,
    //   zoom: 5.5,
    // }));
  }, [events]);

  return (
    <div>
      <Map
        ref={mapRef}
        {...viewState}
        onMove={(e) => setViewState(e.viewState)}
        mapboxAccessToken={process.env.NEXT_PUBLIC_MAPBOX_KEY!}
        style={{ width: "100%", height: 400 }}
        mapStyle="mapbox://styles/mapbox/light-v9"
      >
        {/* {line && selectedLeg &&  (
          <Source id="line_layer" type="geojson" data={line}>
            <Layer
              id="lineLayer"
              type="line"
              source="my-data"
              layout={{
                "line-join": "round",
                "line-cap": "round",
              }}
              paint={{
                "line-color": "rgba(3, 170, 238, 0.5)",
                "line-width": 3,
              }}
            />
          </Source>
        )} */}

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

        {/* {line && (
          <Source type="geojson" data={line}>
            <Layer type="line" id="my_line_attempt" interactive />
          </Source>
        )} */}

        {legObj &&
          Object.entries(legObj).map(([legId, leg]) => {
            const { events, color } = leg;
            const isSelected = legId === selectedLeg;
            return events?.map((event) => {
              const { lat, lng } = event.loc;
              return (
                <Marker
                  key={event.event_id}
                  style={{ opacity: isSelected ? 1 : 0.3 }}
                  latitude={lat}
                  longitude={lng}
                  anchor="bottom"
                >
                  {/* <MapMarker2
                    color={color}
                    onClick={() => {
                      console.log("pin", event);
                    }}
                  /> */}
                  <Box sx={{ position: "relative", bottom: -5 }}>
                    <FaMapMarkerAlt
                      style={{ width: 25, height: 25, color: color[500] }}
                    />
                  </Box>
                </Marker>
              );
            });
          })}
      </Map>
      <DataView data={legObj} title="legObj" />
      <pre style={{ fontSize: 10 }}>{JSON.stringify(viewState, null, 2)}</pre>
    </div>
  );
}

export default TourMap;
