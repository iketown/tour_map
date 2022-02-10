import {
  Typography,
  Link,
  Button,
  List,
  ListItem,
  ListItemIcon,
  TextField,
  Box,
  Divider,
  InputAdornment,
  IconButton,
} from "@mui/material";
import { Form, Field } from "react-final-form";
import React, { useEffect, useState } from "react";
import { useGoogleCal } from "~/hooks/useGoogleCal.tsx/useGoogleCal";
import Layout from "~/layout/Layout";
import DataView from "~/components/DataView";
import { CheckCircle, CircleOutlined } from "@mui/icons-material";
import { useTourFxns } from "~/hooks/formHooks/useTourFxns";
import { useTourCtx } from "~/contexts/TourCtx";
import { Save, Cancel } from "@mui/icons-material";
import TextOrField from "~/components/TextOrField";
import { TourCtxProvider } from "../../contexts/TourCtx";
import { useRouter } from "next/router";

const ListBox = ({ children }) => (
  <Box sx={{ p: 1 }}>
    {children}
    <Divider sx={{ m: 2 }} />
  </Box>
);

const CalendarsIndex = () => {
  const { tourInfo } = useTourCtx();
  const { isSignedIn, signIn, getUserProfile, isLoaded } = useGoogleCal();
  const [public_cal_id, setPublicId] = useState("");
  const [private_cal_id, setPrivateId] = useState("");
  const tour_id = tourInfo?.tour_id;
  useEffect(() => {
    setPublicId(tourInfo?.public_cal_id || "");
    setPrivateId(tourInfo?.private_cal_id || "");
  }, [tourInfo?.public_cal_id, tourInfo?.private_cal_id]);

  const { updateTour } = useTourFxns();
  return (
    <Layout>
      <h3>Calendars</h3>
      <DataView data={{ isSignedIn }} title="googleCal data" />
      <DataView data={{ tourInfo }} title="tourInfo" />
      <ListBox divider>
        <Typography>
          1.{" "}
          <Button
            disabled={isSignedIn || !isLoaded}
            onClick={signIn}
            variant="outlined"
            size="small"
          >
            SIGN IN
          </Button>{" "}
          to your Google calendar account
        </Typography>

        {isSignedIn ? (
          <CheckCircle color="success" />
        ) : (
          <CircleOutlined color="disabled" />
        )}
      </ListBox>
      <ListBox>
        <Typography>
          2. input the Calendar ID for this tour's PUBLIC calendar.
        </Typography>
        <TextOrField
          defaultText={public_cal_id}
          label="PRIVATE cal id"
          onSave={(public_cal_id) =>
            tour_id && updateTour({ tour_id, update: { public_cal_id } })
          }
        >
          <Typography component="pre" variant="subtitle1">
            {public_cal_id}
          </Typography>
        </TextOrField>
      </ListBox>
      <ListBox>
        <Typography>
          3. input the Calendar ID for this tour's PRIVATE calendar.
        </Typography>
        <TextOrField
          defaultText={private_cal_id}
          label="PRIVATE cal id"
          onSave={(private_cal_id) =>
            tour_id && updateTour({ tour_id, update: { private_cal_id } })
          }
        >
          <Typography component="pre" variant="subtitle1">
            {private_cal_id}
          </Typography>
        </TextOrField>
      </ListBox>
      <Button onClick={getUserProfile}>get profile</Button>
    </Layout>
  );
};

const WrappedCalIndex = () => {
  const { query } = useRouter();
  const tour_id = query.tour_id as string;
  return (
    <TourCtxProvider tour_id={tour_id}>
      <CalendarsIndex />
    </TourCtxProvider>
  );
};

export default WrappedCalIndex;
