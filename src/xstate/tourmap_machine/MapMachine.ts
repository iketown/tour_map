import { createMachine, send, forwardTo, assign, AssignAction } from "xstate";
import type { MapMachineAction, MapMachineCtx } from "./mapmachine.types";
import actions, { nullKeys } from "./mapmachine.actions";
import guards from "./mapmachine.guards";
import { mapControl } from "./mapmachine.mapControl";

const initialCtx: MapMachineCtx = {
  map: null,
  mapBounds: null,
  events: {},
  legObj: {},
  selectedEventId: null,
  selectedEvent: null,
  selectedLegId: null,
  selectedAirportId: null,
  fromEventId: null,
  toEventId: null,
  showPOIs: [],
  mapAirports: {
    show: false,
    airports: {},
  },
  poiQueries: {},
};

// https://dev.to/mpocock1/how-to-manage-global-state-with-xstate-and-react-3if5

export const mapMachine = createMachine<MapMachineCtx, MapMachineAction>(
  {
    id: "map_machine",
    context: initialCtx,
    initial: "init",
    on: {
      LOAD_MAP: {
        actions: [
          "loadMap",
          (ctx, evt) => {
            //@ts-ignore
            window.myMap = evt.payload.map;
          },
        ],
      },
      UPDATE_BOUNDS: { actions: "updateBounds" },
      LOAD_LEG_OBJ: { actions: "loadLegObj" },
      LOAD_EVENTS: { actions: "loadEvents" },
      UPDATE_AIRPORTS: {
        actions: "updateAirports",
      },
      SHOW_HIDE_MARKERS: {
        actions: "showHideMarkers",
      },
    },
    states: {
      init: {
        always: [{ target: "active", cond: (ctx) => !!ctx.map }],
      },
      active: {
        always: [
          {
            cond: (ctx, evt) =>
              [
                "FOCUS_EVENT",
                "FOCUS_LEG",
                "FOCUS_TOUR",
                "FOCUS_ROUTE",
                "FOCUS_TWO_POINTS",
                "MAP_POIS",
              ].includes(evt.type),
            actions: forwardTo("mapControl"),
          },
        ],
        invoke: [
          {
            id: "mapControl",
            src: "mapControl",
          },
        ],
        //@ts-ignore
        on: {
          TOGGLE_SELECTED_EVENT: [
            {
              cond: (ctx, evt) => evt.payload.open,
              actions: [
                "toggleSelectedEvent",
                "autoSelectLeg",
                "focusOnEvent",
                nullKeys(["selectedAirportId"]),
              ],
              target: ".eventView",
            },
            {
              actions: [
                "focusOnLeg",
                nullKeys(["selectedEvent", "selectedEventId"]),
              ],
              target: ".legView",
            },
          ],
          TOGGLE_SELECTED_LEG: [
            {
              cond: (ctx, evt) => evt.payload.open,
              target: ".legView", // selecting leg
              actions: ["selectLeg", "focusOnLeg"],
            },
            {
              actions: ["selectLeg", "focusOnTour"], // unselecting leg
              target: ".tourView",
            },
          ],
          SELECT_TRAVEL: {
            target: ".routeView",
            actions: ["selectRouteIds", "focusOnRoute"],
          },
        },
        entry: [forwardTo("mapControl")],
        initial: "tourView",
        states: {
          tourView: {
            entry: [nullKeys(["selectedEvent", "selectedEventId"])],
            id: "TOURVIEW",
            on: {},
          },
          legView: {
            entry: [nullKeys(["selectedEvent", "selectedEventId"])],
            id: "LEGVIEW",
            on: {},
          },
          eventView: {
            id: "EVENTVIEW",
            entry: [nullKeys(["selectedAirportId"])],
            on: {
              ADD_POIS_TO_EVENT: {
                actions: ["addPoisToEvent", "updateMapPOIs"],
              },
              SHOW_HIDE_POIS: {
                actions: ["showHidePois", "updateMapPOIs"],
              },
              SELECT_AIRPORT: {
                actions: ["selectAirport", "focusAirportAndEvent"],
              },
            },
          },
          routeView: {
            entry: [nullKeys(["selectedEvent", "selectedEventId"])],
            exit: [nullKeys(["fromEventId", "toEventId"])],
          },
          poiView: {},
        },
      },
    },
  },
  {
    actions: {
      ...actions,
    },
    guards,
    services: {
      mapControl,
    },
  }
);

export type MapMachineType = typeof mapMachine;
