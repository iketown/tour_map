import type { DecodedIdToken } from "firebase-admin/lib/auth/token-verifier";
import { useRouter } from "next/router";
import React from "react";
import Layout from "~/layout/Layout";
import TextOrField from "~/components/TextOrField";
import { useTourFxns } from "~/hooks/formHooks/useTourFxns";
import { TourCtxProvider, useTourCtx } from "~/contexts/TourCtx";
import TourLegEventList from "./TourLegEventList";
import { MapWrap, useMapCtx } from "~/utils/googleMap/MapWrap";
import { Button, Grid, CircularProgress, Box } from "@mui/material";
import { useLegFxns } from "~/hooks/formHooks/useLegFxns";
import { useLegs } from "~/hooks/useLegs";
import DataView from "~/components/DataView";
import LinkButton from "~/components/LinkButton";
import dynamic from "next/dynamic";
import TourMap2 from "./TourMap";
import { MapboxCtxProvider, useMapboxCtx } from "~/contexts/MapboxCtx";

interface TourIdPageI {
  tour_id: string;
}
const TourIdPage: React.FC<TourIdPageI> = ({ tour_id }) => {
  const { updateTour } = useTourFxns();
  const { tourInfo } = useTourCtx();
  return (
    <Layout>
      {tourInfo ? (
        <>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <TextOrField
              defaultText={tourInfo.title}
              onSave={(title) => {
                updateTour({ tour_id, update: { title } });
              }}
            >
              <h3>{tourInfo.title}</h3>
            </TextOrField>
            <LinkButton
              href="/admin/tours/[tour_id]/calendars"
              as={`/admin/tours/${tour_id}/calendars`}
            >
              Calendars
            </LinkButton>
          </Box>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={5}>
              <TourLegEventList />
            </Grid>
            <Grid item xs={12} sm={7}>
              {/* <DataView data={orderedEvents} title="orderedEvents" />
              <DataView data={legArr} title="legArr" />
              <DataView data={legObj} title="legObj" /> */}
              <TourMap2 />
            </Grid>
          </Grid>
        </>
      ) : (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "80vh",
          }}
        >
          <CircularProgress />
        </Box>
      )}
    </Layout>
  );
};

const WrappedTourPage: React.FC = ({}) => {
  const { query } = useRouter();
  const tour_id = query.tour_id as string;
  return (
    <MapboxCtxProvider>
      <MapWrap>
        <TourCtxProvider tour_id={tour_id}>
          <TourIdPage tour_id={tour_id} />
        </TourCtxProvider>
      </MapWrap>
    </MapboxCtxProvider>
  );
};
export default WrappedTourPage;
