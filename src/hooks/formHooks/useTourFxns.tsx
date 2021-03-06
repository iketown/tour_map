import { doc, setDoc, updateDoc } from "firebase/firestore";
import { useCallback } from "react";
import { useAuthCtx } from "~/contexts/AuthCtx";
import { db } from "~/utils/firebase/clientApp";
import { nanoid } from "nanoid";

export const useTourFxns = () => {
  const { user_id } = useAuthCtx();

  const createTour = useCallback(
    async (tourInfo: Tour) => {
      if (!user_id) return;
      let { tour_id } = tourInfo;
      const updated_at = new Date().valueOf();
      if (!tour_id) {
        tour_id = tourInfo.slug;
        tourInfo.tour_id = tour_id;
        tourInfo.created_by = user_id;
      }
      const docRef = doc(db, "tours", tour_id);
      await setDoc(docRef, { ...tourInfo, updated_at }, { merge: true });
      return tour_id;
    },
    [user_id]
  );

  const updateTour = useCallback(
    async ({ tour_id, update }: { tour_id: string; update: Partial<Tour> }) => {
      if (!user_id || !tour_id) {
        throw new Error(`tour_id: ${tour_id} and user_id: ${user_id} required`);
        return;
      }
      const docRef = doc(db, "tours", tour_id);
      const updated_at = new Date().valueOf();
      return updateDoc(docRef, { ...update, updated_at });
    },
    [user_id]
  );

  return { createTour, updateTour };
};
