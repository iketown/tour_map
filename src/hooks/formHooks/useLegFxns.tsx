import { useRouter } from "next/router";
import { useState, useEffect, useCallback } from "react";
import {
  collection,
  onSnapshot,
  doc,
  updateDoc,
  setDoc,
} from "firebase/firestore";
import { db } from "~/utils/firebase/clientApp";
import { nanoid } from "nanoid";

export const useLegFxns = () => {
  const { query } = useRouter();
  const tour_id = query.tour_id as string;
  const [legs, setLegs] = useState({});

  useEffect(() => {
    if (!tour_id) return;
    const unsub = onSnapshot(
      collection(db, "tours", tour_id, "legs"),
      (snap) => {
        snap.docChanges().forEach(({ doc }) => {
          setLegs((old) => ({ ...old, [doc.id]: doc.data() as Leg }));
        });
      }
    );
    return unsub;
  }, [tour_id]);

  const getLegRef = useCallback(
    (leg_id: string) => {
      if (!tour_id) {
        throw new Error("no tour_id available for leg fxns");
      }
      return doc(db, "tours", tour_id, "legs", leg_id);
    },
    [tour_id]
  );

  const createLeg = useCallback(
    async ({
      start_event_id,
      start_travel_id,
    }: {
      start_event_id: string;
      start_travel_id?: string;
    }) => {
      const leg_id = `leg_${nanoid(6)}`;
      const legRef = getLegRef(leg_id);
      const updated_at = new Date().valueOf();
      const updateObj: TourLeg = {
        start_event_id,
        updated_at,
      };
      await setDoc(legRef, updateObj);
      return leg_id;
    },
    [getLegRef]
  );

  return { legs, createLeg };
};
