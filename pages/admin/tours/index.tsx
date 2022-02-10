import { GetServerSideProps } from "next";
import ToursIndex from "~/page_components/toursIndex/ToursIndex";
import { adminDB, getUser } from "~/utils/firebase/serverApp";

export default ToursIndex;

// export const getServerSideProps: GetServerSideProps = async (ctx) => {
//   try {
//     const user = await getUser(ctx);
//     if (!user)
//       return {
//         props: {
//           error: "no user",
//         },
//       };
//     const myTours = await adminDB
//       .collection("tours")
//       .get()
//       .then(({ docs, size }) => {
//         console.log("docs size", size);
//         const _myTours: { [tour_id: string]: Tour } = {};
//         docs.forEach((doc) => {
//           _myTours[doc.id] = doc.data() as Tour;
//         });
//         console.log({ _myTours });
//         return _myTours;
//       });
//     return {
//       props: {
//         myTours,
//       },
//     };
//   } catch (error) {
//     console.log("ERROR", error);
//     return {
//       redirect: {
//         destination: "/auth/signin",
//         permanent: false,
//       },
//     };
//   }
// };
