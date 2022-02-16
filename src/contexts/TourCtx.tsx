import { doc, onSnapshot } from "firebase/firestore";
import { createContext, useContext, useEffect, useState } from "react";
import { db } from "~/utils/firebase/clientApp";
import { useAuthCtx } from "./AuthCtx";

interface TourCtxI {
  tour_id: string;
  tourInfo?: Tour;
}
const TourCtx = createContext<TourCtxI>({} as TourCtxI);

interface TourCtxProviderI {
  tour_id: string;
}
export const TourCtxProvider: React.FC<TourCtxProviderI> = ({
  children,
  tour_id,
}) => {
  const { user_id } = useAuthCtx();
  const [tourInfo, setTourInfo] = useState<Tour>();

  useEffect(() => {
    if (!user_id || !tour_id) {
      console.error(`missing user_id: ${user_id} or tour_id: ${tour_id}`);
      return;
    }
    const unsub = onSnapshot(doc(db, "tours", tour_id), (snap) => {
      const data = snap.data() as Tour;
      setTourInfo({ ...data, tour_id });
    });
    return unsub;
  }, [tour_id]);
  return (
    <TourCtx.Provider value={{ tour_id, tourInfo }}>
      {children}
    </TourCtx.Provider>
  );
};

export const useTourCtx = () => useContext(TourCtx);
