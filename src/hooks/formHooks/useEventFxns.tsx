import { useAuthCtx } from "~/contexts/AuthCtx";
import { db } from "~/utils/firebase/clientApp";
import { useCallback } from "react";
import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  deleteDoc,
  deleteField,
} from "firebase/firestore";
import { nanoid } from "nanoid";
import { useTourCtx } from "~/contexts/TourCtx";
import { formatInTimeZone } from "date-fns-tz";
import { useGoogleCal } from "../useGoogleCal.tsx/useGoogleCal";

export const useEventFxns = () => {
  const { user_id } = useAuthCtx();
  const { tour_id } = useTourCtx();
  const { updateExtendedProps, isSignedIn } = useGoogleCal();
  const createPlace = useCallback((place: Place) => {
    const { place_id } = place;
    const placeDocRef = doc(db, "places", place_id);
    return getDoc(placeDocRef).then((doc) => {
      if (doc.exists()) {
        return;
      } else {
        return setDoc(placeDocRef, place);
      }
    });
  }, []);

  const updateGoogEvent = useCallback(
    ({ goog_cal_id, event_id }: { goog_cal_id: string; event_id: string }) => {
      if (!isSignedIn) return console.error("not signed in to google cal");
      return updateExtendedProps({
        event_id: goog_cal_id,
        key: "tour_event_id",
        value: event_id,
      });
    },
    [isSignedIn]
  );

  const deleteEvent = useCallback(
    (event_id: string) => {
      if (!tour_id) return;
      const docRef = doc(db, "tours", tour_id, "events", event_id);
      deleteDoc(docRef).then((response) => console.log("deleted", response));
      updateDoc(doc(db, "tours", tour_id), {
        [`events_basic.${event_id}`]: deleteField(),
      });
    },
    [tour_id]
  );

  const updateEvent = useCallback(
    async (values: EventRecord) => {
      if (!user_id || !tour_id) {
        throw new Error(
          `need user_id: ${user_id} and tour_id: ${tour_id} to update Event`
        );
      }
      let {
        place,
        place_id,
        starts_at,
        times = [],
        time_zone,
        event_id,
        title,
        first_of_leg = false,
        goog_cal_id,
      } = values;
      if (!event_id) event_id = `evt_${nanoid(8)}`;
      if (!place || !time_zone) return;
      // check if place already exists by place_id
      const placeP = createPlace(place);
      let googP = Promise.resolve();
      if (goog_cal_id) {
        //@ts-ignore
        googP = updateGoogEvent({ goog_cal_id, event_id });
      }
      const eventP = setDoc(
        doc(db, "tours", tour_id, "events", event_id),
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
          first_of_leg,
          time_zone,
          event_id,
          tour_id,
          title,
          goog_cal_id: goog_cal_id || "",
        },
        { merge: true }
      );
      const tourP = updateDoc(doc(db, "tours", tour_id), {
        [`events_basic.${event_id}`]: {
          loc: {
            lat: place.lat,
            lng: place.lng,
          },
          first_of_leg,
          date: new Date(starts_at).valueOf(),
          event_id,
          venue: place.name || "",
          city: place.cityObj?.short_name || "",
          state: place.stateObj?.short_name || "",
          country: place.countryObj?.short_name || "",
          tz: time_zone.timeZoneId,
          goog_cal_id: goog_cal_id || "",
        },
      });

      await Promise.all([placeP, eventP, tourP, googP]);
      return event_id;
    },
    [user_id, tour_id, updateGoogEvent]
  );
  return { updateEvent, createPlace, deleteEvent };
};
