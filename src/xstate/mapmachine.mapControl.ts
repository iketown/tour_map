import type {
  MapMachineCtx,
  MapMachineAction,
  MapControlAction,
} from "./mapmachine.types";
import { lineString, bbox, point } from "@turf/turf";
import type { Feature, LineString, Properties, BBox } from "@turf/turf";
import type { MapRef } from "react-map-gl";
import type { Sender, Receiver } from "xstate";
import invariant from "tiny-invariant";

const focusOnBox = (box: BBox, map: MapRef) => {
  const [minLng, minLat, maxLng, maxLat] = box;
  map.fitBounds(
    [
      [minLng, minLat],
      [maxLng, maxLat],
    ],
    { padding: 50, duration: 1000, maxZoom: 15 }
  );
};

const focusOnLine = (line: Feature<LineString, Properties>, map: MapRef) => {
  const box = bbox(line);
  focusOnBox(box, map);
};

const focusOnLoc = (
  { lat, lng }: { lat: number; lng: number },
  map: MapRef
) => {
  map.flyTo({
    center: [lng, lat],
    duration: 1000,
    zoom: 7,
  });
};

export const mapControl =
  (ctx: MapMachineCtx, evt: MapMachineAction) =>
  (cb: Sender<MapMachineAction>, onReceive: Receiver<MapControlAction>) => {
    const { map } = ctx;
    invariant(!!map);

    onReceive((e) => {
      console.log("mapcontrol", e);
      switch (e.type) {
        case "FOCUS_EVENT": {
          console.log("focus event", e);
          const { selectedEvent } = e.payload;
          const { lat, lng } = selectedEvent.loc;
          focusOnLoc({ lat, lng }, map);
          break;
        }
        case "FOCUS_LEG":
        case "FOCUS_TOUR": {
          const { events } = e.payload;
          if (events.length < 1) return;
          if (events.length === 1) {
            const {
              loc: { lat, lng },
            } = events[0];
            focusOnLoc({ lat, lng }, map);
            break;
          }
          const line = lineString(
            events.map((ev) => {
              const { lat, lng } = ev.loc;
              return [lng, lat];
            })
          );
          focusOnLine(line, map);
          break;
        }
        case "FOCUS_ROUTE": {
          const { fromEvent, toEvent } = e.payload;
          if (!fromEvent || !toEvent) {
            const { loc } = fromEvent || toEvent || {};
            const lat = loc?.lat;
            const lng = loc?.lng;
            if (lat && lng) {
              focusOnLoc({ lat, lng }, map);
            }
          }
          if (fromEvent && toEvent) {
            const line = lineString(
              [fromEvent, toEvent].map((ev) => {
                const { lat, lng } = ev.loc;
                return [lng, lat];
              })
            );
            focusOnLine(line, map);
            break;
          }
        }
        case "FOCUS_TWO_POINTS": {
          invariant(e.type === "FOCUS_TWO_POINTS");
          const { point1, point2 } = e.payload;
          const line = lineString([
            [point1.lng, point1.lat],
            [point2.lng, point2.lat],
          ]);
          focusOnLine(line, map);
        }
        case "MAP_POIS": {
        }
      }
    });

    const handleMapMove = (
      e: mapboxgl.MapboxEvent<
        MouseEvent | TouchEvent | WheelEvent | undefined
      > &
        mapboxgl.EventData
    ) => {
      const bounds = e.target.getBounds();
      cb({ type: "UPDATE_BOUNDS", payload: { bounds } });
    };
    map.on("moveend", handleMapMove);
    return () => {
      // cleanup
      map.off("moveend", handleMapMove);
      console.log("CLEANUP!");
    };
  };
