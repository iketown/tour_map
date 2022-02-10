import { GetServerSideProps } from "next";
import TourIdPage from "~/page_components/tourid/TourIdPage";
import { getUser } from "~/utils/firebase/serverApp";
import { ParsedUrlQuery } from "querystring";
import { getTourData } from "~/utils/fetcherSS/getTourData";

export default TourIdPage;

interface TourIdParams extends ParsedUrlQuery {
  tour_id: string;
}

// export const getServerSideProps: GetServerSideProps = async (ctx) => {
//   const { tour_id } = ctx.params as TourIdParams;
//   try {
//     const userP = getUser(ctx);
//     const tourInfoP = getTourData(tour_id);
//     const [{ user }, tourInfo] = await Promise.all([userP, tourInfoP]);
//     return {
//       props: { user, tour_id, tourInfo },
//     };
//   } catch (error) {
//     console.log("SS error", error);
//     return {
//       redirect: {
//         destination: "/auth",
//         permanent: false,
//       },
//     };
//   }
// };
