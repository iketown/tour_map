import { assign, send } from "xstate";
import type { AssignAction, SendAction } from "xstate";
import type {
  MapMachineCtx,
  MapMachineAction,
  MapControlAction,
} from "./mapmachine.types";
import invariant from "tiny-invariant";

type MapMachineAssign = AssignAction<MapMachineCtx, MapMachineAction>;
type MapCtrlSend = SendAction<
  MapMachineCtx,
  MapMachineAction,
  MapControlAction
>;

const loadMap: MapMachineAssign = assign((ctx, evt) => {
  invariant(evt.type === "LOAD_MAP");
  const { map } = evt.payload;
  return { ...ctx, map };
});
const updateBounds: MapMachineAssign = assign((ctx, evt) => {
  invariant(evt.type === "UPDATE_BOUNDS");
  return { ...ctx, mapBounds: evt.payload.bounds };
});

const loadLegObj: MapMachineAssign = assign((ctx, evt) => {
  invariant(evt.type === "LOAD_LEG_OBJ");
  return { ...ctx, legObj: evt.payload.legObj };
});

const loadEvents: MapMachineAssign = assign((ctx, evt) => {
  invariant(evt.type === "LOAD_EVENTS");
  return { ...ctx, events: evt.payload.events };
});

const toggleSelectedEvent: MapMachineAssign = assign((ctx, evt) => {
  invariant(evt.type === "TOGGLE_SELECTED_EVENT");
  const { events } = ctx;
  const { event_id, open } = evt.payload;
  if (open) {
    return {
      ...ctx,
      selectedEventId: event_id,
      selectedEvent: events[event_id],
    };
  } else {
    return {
      ...ctx,
      selectedEvent: null,
      selectedEventId: null,
    };
  }
});

const selectLeg: MapMachineAssign = assign((ctx, evt) => {
  invariant(evt.type === "TOGGLE_SELECTED_LEG");
  const { leg_id, open } = evt.payload;
  return { ...ctx, selectedLegId: open ? leg_id : "" };
});

const selectAirport: MapMachineAssign = assign((ctx, evt) => {
  invariant(evt.type === "SELECT_AIRPORT");
  const { iata_code, selected } = evt.payload;
  return { ...ctx, selectedAirportId: selected ? iata_code : "" };
});

const autoSelectLeg: MapMachineAssign = assign((ctx, evt) => {
  const { selectedEventId, legObj } = ctx;
  if (!selectedEventId) return { ...ctx, selectedLegId: "" };
  const containingLeg =
    legObj &&
    Object.entries(legObj).find(([legId, leg]) => {
      return leg.events.find((ev) => ev.event_id === selectedEventId);
    });
  const selectedLegId = containingLeg ? containingLeg[0] : "";
  return { ...ctx, selectedLegId };
});

const selectRouteIds: MapMachineAssign = assign((ctx, evt) => {
  invariant(evt.type === "SELECT_TRAVEL");
  const { fromEventId, toEventId } = evt.payload;
  return { ...ctx, fromEventId, toEventId };
});

const addPoisToEvent: MapMachineAssign = assign((ctx, evt) => {
  invariant(evt.type === "ADD_POIS_TO_EVENT");
  const { event_id, queryString, results } = evt.payload;
  const { poiQueries } = ctx;
  const newPoiQueries = poiQueries ? { ...poiQueries } : {};
  newPoiQueries[event_id] = {
    ...poiQueries[event_id],
    [queryString]: { results, show: true },
  };
  return {
    ...ctx,
    poiQueries: newPoiQueries,
  };
});

const showHidePois: MapMachineAssign = assign((ctx, evt) => {
  invariant(evt.type === "SHOW_HIDE_POIS");
  const { event_id, queryString, show } = evt.payload;
  const newPoiQueries = { ...ctx.poiQueries };
  if (newPoiQueries[event_id] && newPoiQueries[event_id][queryString]) {
    newPoiQueries[event_id][queryString].show = show;
  }
  return { ...ctx, poiQueries: newPoiQueries };
});

const updateMapPOIs: MapCtrlSend = send(
  (ctx, evt) => {
    const { poiQueries, selectedEventId } = ctx;
    invariant(selectedEventId);
    return {
      type: "MAP_POIS",
      payload: { poiQueries, event_id: selectedEventId },
    };
  },
  {
    to: "mapControl",
  }
);

const updateAirports: MapMachineAssign = assign((ctx, evt) => {
  invariant(evt.type === "UPDATE_AIRPORTS");
  const { airports } = evt.payload;
  const { mapAirports } = ctx;
  const newMapAirports = {
    show: true,
    airports: { ...mapAirports?.airports, ...airports },
  };
  return { ...ctx, mapAirports: newMapAirports };
});

const showHideMarkers: MapMachineAssign = assign((ctx, evt) => {
  invariant(evt.type === "SHOW_HIDE_MARKERS");
  const { type, show } = evt.payload;
  const mapAirports = ctx.mapAirports || { airports: {}, show: true };
  switch (type) {
    case "airports":
      return { ...ctx, mapAirports: { ...mapAirports, show } };
    default:
      return ctx;
  }
});
const focusOnEvent: MapCtrlSend = send(
  (ctx, evt) => {
    const { selectedEvent } = ctx;
    invariant(!!selectedEvent, "event must be selected");
    return { type: "FOCUS_EVENT", payload: { selectedEvent } };
  },
  { to: "mapControl" }
);
const focusOnLeg: MapCtrlSend = send(
  (ctx, evt) => {
    const { selectedLegId, legObj } = ctx;
    invariant(!!selectedLegId, "leg must be selected");
    const { events } = legObj[selectedLegId];
    return { type: "FOCUS_LEG", payload: { events } };
  },
  { to: "mapControl" }
);

const focusOnTour: MapCtrlSend = send(
  (ctx, evt) => {
    const { events } = ctx;
    return { type: "FOCUS_TOUR", payload: { events: Object.values(events) } };
  },
  { to: "mapControl" }
);

const focusOnRoute: MapCtrlSend = send(
  (ctx, evt) => {
    const { events } = ctx;
    let fromEvent = null;
    let toEvent = null;
    if (evt.type === "SELECT_TRAVEL") {
      fromEvent = evt.payload.fromEventId
        ? events[evt.payload.fromEventId]
        : null;
      toEvent = evt.payload.toEventId ? events[evt.payload.toEventId] : null;
    }
    return { type: "FOCUS_ROUTE", payload: { fromEvent, toEvent } };
  },
  { to: "mapControl" }
);

const focusAirportAndEvent: MapCtrlSend = send(
  (ctx, evt) => {
    const { selectedAirportId, mapAirports, selectedEvent } = ctx;
    const selectedAP =
      mapAirports?.airports && selectedAirportId
        ? mapAirports.airports[selectedAirportId]
        : null;
    if (selectedEvent && selectedAP) {
      const point1 = selectedAP;
      const point2 = selectedEvent.loc;
      return { type: "FOCUS_TWO_POINTS", payload: { point1, point2 } };
    } else if (selectedEvent) {
      return { type: "FOCUS_EVENT", payload: { selectedEvent } };
    } else {
      return { type: "NONE" };
    }
  },
  { to: "mapControl" }
);

export const nullKeys = (keys: (keyof MapMachineCtx)[]): MapMachineAssign =>
  assign((ctx: MapMachineCtx) => {
    const newCtx = { ...ctx };
    keys.forEach((key) => {
      //@ts-ignore
      newCtx[key] = null;
    });
    return newCtx;
  });

const actions = {
  loadMap,
  updateBounds,
  loadEvents,
  loadLegObj,
  toggleSelectedEvent,
  autoSelectLeg,
  selectLeg,
  selectAirport,
  focusAirportAndEvent,
  focusOnLeg,
  focusOnEvent,
  focusOnTour,
  focusOnRoute,
  selectRouteIds,
  addPoisToEvent,
  showHidePois,
  updateMapPOIs,
  updateAirports,
  showHideMarkers,
};
export default actions;
