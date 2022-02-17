import { useSelector } from "@xstate/react";
import React, { useState } from "react";
import { useMapboxCtx } from "~/contexts/MapboxCtx";
import { useMapCtx } from "~/utils/googleMap/MapWrap";
import MapViewTabs from "./MapViewTabs";
import SelectedEventView from "./SelectedEventTitle";

const EventBox = () => {
  const { placesService } = useMapCtx();
  const { mapService } = useMapboxCtx();
  const event = useSelector(mapService, ({ context }) => context.selectedEvent);
  const map = useSelector(mapService, ({ context }) => context.map);
  const poiQ = useSelector(mapService, ({ context }) => context.poiQueries);
  const myPois = poiQ && event?.event_id && poiQ[event?.event_id];

  const [poiText, setPoiText] = useState("starbucks");

  if (!event) return null;
  const { city, state, loc, event_id, venue, date } = event;

  const handleSearchBox = () => {
    if (!event_id) return;
    const bounds = map?.getBounds();
    const request: google.maps.places.TextSearchRequest = { query: poiText };
    if (!!bounds) {
      console.log("using bounds");
      const sw = bounds.getSouthWest();
      const ne = bounds.getNorthEast();
      const googBounds = new google.maps.LatLngBounds(sw, ne);
      request.bounds = googBounds;
    } else {
      console.log("using center and radius");
      request.location = loc;
      request.radius = 100;
    }
    placesService?.textSearch(request, (results) => {
      console.log("placessvc result", results);
      if (results?.length) {
        console.log({ results });
        mapService.send({
          type: "ADD_POIS_TO_EVENT",
          payload: { event_id, queryString: poiText, results },
        });
      }
    });
  };
  return (
    <div>
      <SelectedEventView />
      <MapViewTabs />
    </div>
  );
};

export default EventBox;
