import { createMachine } from "xstate";

export const travelMapMachine = createMachine({
  id: "travel_map_machine",
  initial: "chooseType",
  states: {
    chooseType: {
      // air ground or rail
    },
    air: {
      // choose origin and destination airports
    },
    ground: {
      // choose origin and destination address
      // these will be populated with previous and next events, and any associated hotels
    },
    rail: {
      // origin and destination stations
    },
  },
});
