import type { Dispatch, SetStateAction, RefObject } from "react";
import type { MapRef, LngLat } from "react-map-gl";
import type { Feature, Point, Properties } from "@turf/turf";
import type { LegObj } from "~/hooks/useLegs";
import { ValueOf } from "type-fest";
import { poiTypes } from "./poiTypes";
import type { POItype } from "./poiTypes";
import { NoEncryptionGmailerrorredOutlined } from "@mui/icons-material";

export type POIKey = POItype["name"];

export type POIQueries = {
  [event_id: string]: {
    [queryString: string]: {
      show: boolean;
      results: google.maps.places.PlaceResult[];
    };
  };
};

export type MapMachineCtx = {
  map: MapRef | null;
  mapBounds: mapboxgl.LngLatBounds | null;
  events: AllEventsBasic;
  legObj: LegObj;
  selectedEventId: string | null;
  selectedEvent: EventBasic | null;
  selectedLegId: string | null;
  fromEventId: string | null;
  toEventId: string | null;
  showPOIs: POIKey[];
  mapAirports: {
    show: boolean;
    airports: {
      [iata_code: string]: AirportPoi;
    };
  };
  placesService?: google.maps.places.PlacesService;
  poiQueries: POIQueries;
};

export type MapMachineAction =
  | MapControlAction
  | { type: "LOAD_MAP"; payload: { map: MapRef } }
  | { type: "UPDATE_BOUNDS"; payload: { bounds: mapboxgl.LngLatBounds } }
  | {
      type: "LOAD_LEG_OBJ";
      payload: { legObj: LegObj };
    }
  | { type: "LOAD_EVENTS"; payload: { events: AllEventsBasic } }
  | {
      type: "TOGGLE_SELECTED_EVENT";
      payload: { event_id: string; open: boolean };
    }
  | {
      type: "TOGGLE_SELECTED_LEG";
      payload: { leg_id: string; open: boolean };
    }
  | {
      type: "SELECT_TRAVEL";
      payload: { fromEventId?: string; toEventId?: string };
    }
  | {
      type: "ADD_POIS_TO_EVENT";
      payload: {
        event_id: string;
        queryString: string;
        results: google.maps.places.PlaceResult[];
      };
    }
  | {
      type: "SHOW_HIDE_POIS";
      payload: {
        event_id: string;
        queryString: string;
        show: boolean;
      };
    }
  | {
      type: "ADD_PLACES_SVC";
      payload: { placesService: google.maps.places.PlacesService };
    }
  | {
      type: "UPDATE_AIRPORTS";
      payload: {
        airports: {
          [iata_code: string]: AirportPoi;
        };
      };
    }
  | {
      type: "SHOW_HIDE_MARKERS";
      payload: {
        type: "airports" | "hotels" | "gas_stations";
        show: boolean;
      };
    };

export type MapControlAction =
  | {
      type: "FOCUS_EVENT";
      payload: { selectedEvent: EventBasic };
    }
  | {
      type: "FOCUS_LEG";
      payload: { events: EventBasic[] };
    }
  | { type: "FOCUS_TOUR"; payload: { events: EventBasic[] } }
  | {
      type: "FOCUS_ROUTE";
      payload: {
        fromEvent: EventBasic | null;
        toEvent: EventBasic | null;
      };
    }
  | {
      type: "FOCUS_TWO_POINTS";
      payload: {
        point1: { lat: number; lng: number };
        point2: { lat: number; lng: number };
      };
    }
  | {
      type: "MAP_POIS";
      payload: { poiQueries: POIQueries; event_id: string };
    };

// https://steveholgado.com/typescript-types-from-arrays/

export type PlacesServiceAction = {
  type: "GET_PLACES";
  payload: {
    event_id: string;
    poiTypes: POIKey[];
    types_searched: string[];
  };
};
