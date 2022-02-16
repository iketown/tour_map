import { useSelector } from "@xstate/react";
import React from "react";
import { useMapboxCtx } from "~/contexts/MapboxCtx";
import RouteBox from "./RouteBox";
import EventBox from "./EventView/EventBox";

const MapInfoSwitch = () => {
  const { mapService } = useMapboxCtx();
  const view = useSelector(mapService, ({ matches }) => {
    return ["eventView", "routeView", "legView", "tourView"].find((str) =>
      matches({ active: str })
    );
  });

  switch (view) {
    case "eventView": {
      return <EventBox />;
    }
    case "routeView": {
      return <RouteBox />;
    }
    case "legView": {
      return <h3>legView</h3>;
    }
    case "tourView": {
      return <h3>tourView</h3>;
    }
    default:
      return null;
  }
};

export default MapInfoSwitch;
