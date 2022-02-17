import { Box, CircularProgress, Divider, Grid } from "@mui/material";
import { useRouter } from "next/router";
import React from "react";
import LinkButton from "~/components/LinkButton";
import TextOrField from "~/components/TextOrField";
import { MapboxCtxProvider } from "~/contexts/MapboxCtx";
import { TourCtxProvider, useTourCtx } from "~/contexts/TourCtx";
import { useTourFxns } from "~/hooks/formHooks/useTourFxns";
import Layout from "~/layout/Layout";
import { MapWrap } from "~/utils/googleMap/MapWrap";
import TourLegEventList from "./TourLegEventList";
import TourMap from "../../components/mapbox/TourMap";
import DataView from "../../components/DataView";
import MapInfoSwitch from "./infobox/MapInfoSwitch";

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
              <TourMap />
              <Divider sx={{ my: 1 }} />
              <MapInfoSwitch />
              <Box mb={15} />
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
    <TourCtxProvider tour_id={tour_id}>
      <MapWrap>
        <MapboxCtxProvider>
          <TourIdPage tour_id={tour_id} />
        </MapboxCtxProvider>
      </MapWrap>
    </TourCtxProvider>
  );
};
export default WrappedTourPage;
