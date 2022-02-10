import { adminDB } from "~/utils/firebase/serverApp";

export const getTourData = (tour_id: string): Promise<Tour | null> => {
  return adminDB
    .collection("tours")
    .doc(tour_id)
    .get()
    .then((doc) => (doc.exists ? (doc.data() as Tour) : null));
};
