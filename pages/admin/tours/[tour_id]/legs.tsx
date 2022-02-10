import Legs from "~/page_components/legs/Legs";
import type { GetServerSideProps } from "next";
import type { ParsedUrlQuery } from "querystring";
import { getTourData } from "~/utils/fetcherSS/getTourData";

export default Legs;

interface TourIdParams extends ParsedUrlQuery {
  tour_id: string;
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const { tour_id } = ctx.params as TourIdParams;
  const tourInfo = await getTourData(tour_id);
  return {
    props: {
      tourInfo,
    },
  };
};
