import type {
  MapMachineCtx,
  MapMachineAction,
  PlacesServiceAction,
} from "./mapmachine.types";
import { lineString, bbox, point } from "@turf/turf";
import type { Feature, LineString, Properties, BBox } from "@turf/turf";
import type { MapRef } from "react-map-gl";
import type { Sender, Receiver } from "xstate";
import invariant from "tiny-invariant";

//! cant get this to focus on the type input variable.   i.e. i put in "airport" for type and it has NO RESULTS
// ! though it can find "cafe".

export const placeSearchService =
  (ctx: MapMachineCtx, evt: MapMachineAction) =>
  (cb: Sender<MapMachineAction>, onReceive: Receiver<PlacesServiceAction>) => {
    onReceive((e) => {
      const { event_id, poiTypes } = e.payload;
      const event = ctx.events[event_id];
      invariant(event, "event missing");
      const { lat, lng } = event.loc;
      poiTypes.forEach((type) => {
        console.log("searching for", type);

        ctx.placesService?.nearbySearch(
          {
            location: { lat, lng },
            radius: 300,
            keyword: "starbucks",
          },
          (result, status) => {
            console.log("places result", status, type, result);
          }
        );
        console.log("places rx", event, e);
      });
    });
  };
