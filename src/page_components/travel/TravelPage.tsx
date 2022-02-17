import React from "react";
import Layout from "~/layout/Layout";
import { useRouter } from "next/router";
import { Button } from "@mui/material";
import { TourCtxProvider } from "~/contexts/TourCtx";
import { MapWrap } from "~/utils/googleMap/MapWrap";
import { MapboxCtxProvider } from "~/contexts/MapboxCtx";
import { ParsedUrlQuery } from "querystring";

interface TravelPageQuery extends ParsedUrlQuery {
  tour_id: string;
  o?: string; // origin event id
  d?: string; // destination event id
}
const TravelPage = () => {
  const { back, query } = useRouter();
  const { tour_id, o, d } = query as TravelPageQuery;
  return (
    <Layout>
      <Button onClick={back}>back</Button>
      TravelPage
      <pre style={{ fontSize: 10 }}>{JSON.stringify({ tour_id, o, d })}</pre>
    </Layout>
  );
};

const WrappedTravelPage: React.FC = () => {
  const { query } = useRouter();
  const tour_id = query.tour_id as string;
  return (
    <TourCtxProvider {...{ tour_id }}>
      <MapWrap>
        <MapboxCtxProvider>
          <TravelPage />
        </MapboxCtxProvider>
      </MapWrap>
    </TourCtxProvider>
  );
};

export default WrappedTravelPage;
