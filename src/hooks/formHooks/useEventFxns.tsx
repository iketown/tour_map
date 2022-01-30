import { useAuthCtx } from "~/contexts/AuthCtx";
import { db } from "~/utils/firebase/clientApp";
import { useCallback } from "react";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { nanoid } from "nanoid";

export const useEventFxns = () => {
  const { user_id } = useAuthCtx();
  const updateEvent = useCallback(
    async (values: EventRecord) => {
      if (!user_id) return;
      let { place, place_id, starts_at, times, time_zone, event_id } = values;
      if (!event_id) event_id = `evt_${nanoid(8)}`;
      if (!place) return;
      // check if place already exists by place_id
      const placeDocRef = doc(db, "places", place_id);
      const placeP = getDoc(placeDocRef).then((doc) => {
        if (doc.exists()) {
          return;
        } else {
          return setDoc(placeDocRef, place);
        }
      });
      const eventP = setDoc(
        doc(db, "users", user_id, "events", event_id),
        {
          place_id,
          starts_at: new Date(starts_at).valueOf(),
          times: times.map((t) => {
            const time = new Date(t.time).valueOf();
            const newTimeObj = { ...t, time };
            const endTime = t.endTime && new Date(t.endTime).valueOf();
            if (endTime) newTimeObj.endTime = endTime;
            return newTimeObj;
          }),
          time_zone,
          event_id,
        },
        { merge: true }
      );

      await Promise.all([placeP, eventP]);
      return event_id;
    },
    [user_id]
  );
  return { updateEvent };
};
