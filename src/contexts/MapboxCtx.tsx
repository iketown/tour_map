import { createContext, useContext, useState, useRef, useEffect } from "react";
import { useLegs } from "~/hooks/useLegs";
import type { Dispatch, SetStateAction, RefObject } from "react";
import type { MapRef } from "react-map-gl";

import { useInterpret } from "@xstate/react";
import {
  mapMachine,
  MapMachineType,
} from "~/xstate/tourmap_machine/MapMachine";
import type { ActorRefFrom } from "xstate";
import { useTourCtx } from "./TourCtx";
import { useMapCtx } from "~/utils/googleMap/MapWrap";

interface MapboxCtxI {
  selectedLeg: string;
  setSelectedLeg: Dispatch<SetStateAction<string>>;
  selectedEventId: string;
  selectEvent: (event_id: string) => void;
  selectedEvent: EventBasic | null;
  mapRef: RefObject<MapRef>;
  mapService: ActorRefFrom<MapMachineType>;
}

const MapboxCtx = createContext<MapboxCtxI>({} as MapboxCtxI);

export const MapboxCtxProvider: React.FC = ({ children }) => {
  const { legObj } = useLegs();
  const { tourInfo, tour_id } = useTourCtx();
  const mapRef = useRef<MapRef>(null);
  const [selectedLeg, setSelectedLeg] = useState("");
  const [selectedEventId, setSelectedEventId] = useState("");
  const [selectedEvent, setSelectedEvent] = useState<EventBasic | null>(null);
  const { placesService } = useMapCtx();

  const mapService = useInterpret(mapMachine);

  useEffect(() => {
    if (!!placesService) {
      console.log({ placesService });
      mapService.send({ type: "ADD_PLACES_SVC", payload: { placesService } });
    }
  }, [placesService]);

  const selectEvent = (event_id: string) => {
    // also select the leg which contains this event.
    const leg = Object.entries(legObj).find(([leg_id, leg]) => {
      const _selectedEvent = leg.events.find((ev) => ev.event_id === event_id);
      setSelectedEvent(_selectedEvent || null);
      return !!_selectedEvent;
    });
    if (leg) {
      const [leg_id] = leg;
      console.log({ event_id, leg_id });
      setSelectedLeg(leg_id);
    } else {
      console.log("leg not found", event_id);
    }
    setSelectedEventId(event_id);
  };

  useEffect(() => {
    if (!legObj) return;

    mapService.send({
      type: "LOAD_LEG_OBJ",
      payload: { legObj },
    });
  }, [tourInfo]);

  useEffect(() => {
    if (!tourInfo) return;
    mapService.send({
      type: "LOAD_EVENTS",
      payload: { events: tourInfo.events_basic },
    });
  }, [tourInfo]);

  return (
    <MapboxCtx.Provider
      value={{
        selectedLeg,
        setSelectedLeg,
        selectedEventId,
        selectedEvent,
        selectEvent,
        mapRef,
        //@ts-ignore
        mapService,
      }}
    >
      {children}
    </MapboxCtx.Provider>
  );
};

export const useMapboxCtx = () => useContext(MapboxCtx);
