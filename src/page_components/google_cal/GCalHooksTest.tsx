import React, { useState } from "react";
import { useGoogleCal } from "~/hooks/useGoogleCal.tsx/useGoogleCal";
import Layout from "~/layout/Layout";
import {
  Button,
  Card,
  CardHeader,
  CardContent,
  CardActions,
  Grid,
  TextField,
  InputAdornment,
  IconButton,
  Box,
} from "@mui/material";
import { Cancel, ConstructionOutlined, Save } from "@mui/icons-material";
import { MapWrap, useMapCtx } from "~/utils/googleMap/MapWrap";
import { googlePlaceParse } from "~/components/google/googlePlaceParse";
import GoogPlacesAC from "~/components/google/GoogPlacesAC";

const GCalHooksTest = () => {
  const { signIn, signOut, isSignedIn, calEvents, listEvents } = useGoogleCal();
  return (
    <MapWrap>
      <Box sx={{ p: 2 }}>
        {isSignedIn ? (
          <Button variant="contained" onClick={signOut}>
            Sign Out
          </Button>
        ) : (
          <Button variant="contained" onClick={signIn}>
            Sign In
          </Button>
        )}
      </Box>

      <Grid container spacing={2}>
        {calEvents?.map((ev) => {
          return <GigCard key={ev.id} calEvent={ev} />;
        })}
      </Grid>
      <Button onClick={listEvents}>List Events</Button>
      {calEvents ? (
        <pre style={{ fontSize: 10 }}>{JSON.stringify(calEvents, null, 2)}</pre>
      ) : (
        <div>no events</div>
      )}
    </MapWrap>
  );
};

export default GCalHooksTest;

interface GigCardI {
  calEvent: CalEvent;
}
const GigCard: React.FC<GigCardI> = ({ calEvent }) => {
  const [editing, setEditing] = useState(false);
  const [summary, setSummary] = useState(calEvent.summary);
  const { placesService, acService } = useMapCtx();
  const [key, setKey] = useState("");
  const [value, setValue] = useState("");
  const { updateKey, updateExtendedProps } = useGoogleCal();

  const handleSelectedPlace = (place: any) => {
    console.log("selected place", place);
    const placeId = place?.place_id;
    if (!!placeId) {
      placesService?.getDetails({ placeId }, (place) => {
        const parsedPlace = place && googlePlaceParse(place);
        console.log("parsedPlace", parsedPlace);
      });
    }
  };

  const handleSave = () => {
    setEditing(false);
  };
  const handleCancel = () => {
    setEditing(false);
  };

  const getPrediction = (input: string) => {
    acService?.getPlacePredictions({ input }).then((result) => {
      console.log("prediction result", result.predictions[0]);
      if (result?.predictions && result.predictions[0]) {
        handleSelectedPlace(result.predictions[0]);
      }
    });
  };
  return (
    <Grid item xs={6} sm={4}>
      <Card>
        {editing ? (
          <TextField
            value={summary}
            onChange={(e) => setSummary(e.target.value)}
            label="summary"
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={handleCancel}>
                    <Cancel />
                  </IconButton>
                  <IconButton onClick={handleSave}>
                    <Save />
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
        ) : (
          <CardHeader title={calEvent.summary} />
        )}
        <CardContent>
          {!calEvent.location && (
            <GoogPlacesAC {...{ handleSelectedPlace }} label="Location" />
          )}
        </CardContent>
        <CardActions>
          <Button onClick={() => setEditing(true)}>Edit</Button>
          <Button onClick={() => {}}>save</Button>
          <Button
            onClick={() => {
              console.log(calEvent);
              if (calEvent.location) {
                getPrediction(calEvent.location);
              } else {
                console.log("no location", calEvent);
              }
            }}
          >
            log
          </Button>
        </CardActions>
      </Card>
    </Grid>
  );
};
