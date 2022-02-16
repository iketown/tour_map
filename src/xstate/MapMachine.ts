import { placeSearchService } from "./mapmachine.placesSearchSvc";
import { createMachine, send, forwardTo, assign } from "xstate";
import type { MapMachineAction, MapMachineCtx } from "./mapmachine.types";
import actions from "./mapmachine.actions";
import guards from "./mapmachine.guards";
import { mapControl } from "./mapmachine.mapControl";

const initialCtx: MapMachineCtx = {
  map: null,
  selectedEventId: null,
  selectedEvent: null,
  selectedLegId: null,
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
            window.myMap = evt.payload.map;
          },
        ],
      },
      UPDATE_BOUNDS: { actions: "updateBounds" },
      LOAD_LEG_OBJ: { actions: "loadLegObj" },
      LOAD_EVENTS: { actions: "loadEvents" },
      ADD_PLACES_SVC: {
        actions: assign({
          placesService: (ctx, evt) => evt.payload.placesService,
        }),
      },
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
        invoke: [
          {
            id: "mapControl",
            src: "mapControl",
          },
        ],
        on: {
          "*": {
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
          TOGGLE_SELECTED_EVENT: [
            {
              cond: (ctx, evt) => evt.payload.open,
              actions: ["toggleSelectedEvent", "autoSelectLeg", "focusOnEvent"],
              target: ".eventView",
            },
            {
              actions: ["unselectEvent", "focusOnLeg"],
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
            entry: ["unselectEvent"],
            id: "TOURVIEW",
            on: {},
          },
          legView: {
            entry: ["unselectEvent"],
            id: "LEGVIEW",
            on: {},
          },
          eventView: {
            invoke: {
              id: "placesService",
              src: placeSearchService,
            },
            id: "EVENTVIEW",
            on: {
              ADD_POIS_TO_EVENT: {
                actions: ["addPoisToEvent", "updateMapPOIs"],
              },
              SHOW_HIDE_POIS: {
                actions: ["showHidePois", "updateMapPOIs"],
              },
            },
          },
          routeView: {
            entry: ["unselectEvent"],
            exit: ["unselectRouteIds"],
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
