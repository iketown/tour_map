import { useSelector } from "@xstate/react";
import { useMapboxCtx } from "~/contexts/MapboxCtx";

export const useMapBounds = () => {
  const { mapService } = useMapboxCtx();
  const bounds = useSelector(mapService, ({ context }) => context.mapBounds);
  const isOnMap = (loc: { lat: number; lng: number }) => {
    return bounds?.contains(loc);
  };

  return { isOnMap };
};
