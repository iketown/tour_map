import { doc, setDoc } from "firebase/firestore";
import { useCallback } from "react";
import { useAuthCtx } from "~/contexts/AuthCtx";
import { db } from "~/utils/firebase/clientApp";
import { nanoid } from "nanoid";

export const useTourFxns = () => {
  const { user_id } = useAuthCtx();

  const updateTour = useCallback(
    async (tourInfo: Tour) => {
      if (!user_id) return;
      let { tour_id } = tourInfo;
      const updated_at = new Date().valueOf();
      if (!tour_id) {
        tour_id = `t_${nanoid(6)}`;
        tourInfo.tour_id = tour_id;
        tourInfo.created_by = user_id;
      }
      const docRef = doc(db, "tours", tour_id);
      await setDoc(docRef, { ...tourInfo, updated_at }, { merge: true });
      return tour_id;
    },
    [user_id]
  );

  return { updateTour };
};
