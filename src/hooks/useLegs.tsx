import { useTourCtx } from "~/contexts/TourCtx";
import { useMemo } from "react";
import { legColors } from "../utils/mapBox/legColors";
import type { Color } from "@mui/material";

export const useLegs = () => {
  const { tourInfo } = useTourCtx();
  const orderedEvents = useMemo(() => {
    if (!tourInfo?.events_basic) return {};
    const ordered = Object.entries(tourInfo.events_basic)
      .filter(([id, obj]) => !!obj) // get rid of null
      .sort(([_, a], [__, b]) => a?.date - b?.date)
      .map(([id, obj]) => obj);
    const first = ordered[0];
    const last = ordered[ordered.length - 1];
    return { first, last, ordered };
  }, [tourInfo]);

  const legArr = useMemo(() => {
    const _legArr: EventBasic[][] = [];
    let legIndex = 0;
    orderedEvents?.ordered?.forEach((evt, i) => {
      if (i !== 0 && evt?.first_of_leg) {
        legIndex++;
      }
      if (_legArr[legIndex]) {
        _legArr[legIndex].push(evt);
      } else {
        _legArr[legIndex] = [evt];
      }
    });
    return _legArr;
  }, [orderedEvents]);

  const legObj = legArr?.reduce(
    (
      obj: {
        [leg_id: string]: {
          events: EventBasic[];
          color: Color;
          first: {
            city: string;
            state: string;
            date: number;
            tz: string;
          };
          last: {
            city: string;
            state: string;
            date: number;
            tz: string;
          };
        };
      },
      leg,
      index
    ) => {
      const firstGig = leg[0];
      const lastGig = leg[leg.length - 1];
      const leg_id = `leg_${firstGig.event_id}`;
      const placeH = "..";

      obj[leg_id] = {
        color: legColors[index % legColors.length],
        events: leg,
        first: {
          city: firstGig?.city || placeH,
          state: firstGig?.state || placeH,
          date: firstGig.date,
          tz: firstGig.tz,
        },
        last: {
          city: lastGig?.city || placeH,
          state: lastGig?.state || placeH,
          date: lastGig.date,
          tz: lastGig.tz,
        },
      };
      return obj;
    },
    {}
  );

  return { orderedEvents, legArr, legObj };
};
