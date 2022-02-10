import { GetServerSideProps } from "next";
import EventIdPage from "~/page_components/eventid/EventIdPage";
import type { EventIdPageI } from "~/page_components/eventid/EventIdPage";
import { adminDB, getUser } from "~/utils/firebase/serverApp";
import { ParsedUrlQuery } from "querystring";
import { getTourData } from "~/utils/fetcherSS/getTourData";

// interface EventIdQuery extends ParsedUrlQuery {
//   tour_id: string;
//   event_id: string;
// }

// export const getServerSideProps: GetServerSideProps<
//   EventIdPageI,
//   EventIdQuery
// > = async (ctx) => {
//   const { tour_id, event_id } = ctx.params!;
//   try {
//     const userP = getUser(ctx);
//     const eventRecord = await adminDB
//       .collection("tours")
//       .doc(tour_id)
//       .collection("events")
//       .doc(event_id)
//       .get()
//       .then((doc) => doc.data() as EventRecord);
//     const { place_id } = eventRecord;

//     const placeP = adminDB
//       .collection("places")
//       .doc(place_id)
//       .get()
//       .then((doc) => doc.data() as Place);

//     const tourP = getTourData(tour_id);

//     return Promise.all([userP, placeP, tourP]).then(
//       ([user, place, tourInfo]) => {
//         eventRecord.place = place;
//         return {
//           props: { user, eventRecord, tour_id, tourInfo },
//         };
//       }
//     );
//   } catch (error) {
//     return {
//       props: {
//         tour_id,
//         user: null,
//         eventRecord: null,
//         tourInfo: null,
//       },
//     };
//   }
// };

export default EventIdPage;
