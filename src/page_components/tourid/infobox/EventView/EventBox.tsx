import { useSelector } from "@xstate/react";
import React, { useState } from "react";
import { useMapboxCtx } from "~/contexts/MapboxCtx";
import { useMapCtx } from "~/utils/googleMap/MapWrap";
import DataView from "~/components/DataView";
import SelectedEventView from "./SelectedEventTitle";
import MapViewTabs from "./MapViewTabs";

import {
  Box,
  Stack,
  Typography,
  Button,
  TextField,
  InputAdornment,
  Avatar,
  Icon,
} from "@mui/material";
import { poiTypes } from "~/xstate/poiTypes";
import { Chip } from "@mui/material";

import { Grid } from "@mui/material";

import PoiSelectBox from "../PoiSelectBox";
import invariant from "tiny-invariant";
import GoogPlacesAc from "~/components/google/GoogPlacesAC";

const EventBox = () => {
  const { placesService } = useMapCtx();
  const { mapService } = useMapboxCtx();
  const event = useSelector(mapService, ({ context }) => context.selectedEvent);
  const map = useSelector(mapService, ({ context }) => context.map);
  const poiQ = useSelector(mapService, ({ context }) => context.poiQueries);
  const myPois = poiQ && event?.event_id && poiQ[event?.event_id];

  const [poiText, setPoiText] = useState("starbucks");

  if (!event) return null;
  const { city, state, loc, event_id, venue, date } = event;

  const handleSearchBox = () => {
    if (!event_id) return;
    const bounds = map?.getBounds();
    const request: google.maps.places.TextSearchRequest = { query: poiText };
    if (!!bounds) {
      console.log("using bounds");
      const sw = bounds.getSouthWest();
      const ne = bounds.getNorthEast();
      const googBounds = new google.maps.LatLngBounds(sw, ne);
      request.bounds = googBounds;
    } else {
      console.log("using center and radius");
      request.location = loc;
      request.radius = 100;
    }
    placesService?.textSearch(request, (results) => {
      console.log("placessvc result", results);
      if (results?.length) {
        console.log({ results });
        mapService.send({
          type: "ADD_POIS_TO_EVENT",
          payload: { event_id, queryString: poiText, results },
        });
      }
    });
  };
  return (
    <div>
      {/* <Stack direction={"row"} justifyContent="space-between" spacing={2}>
        <Typography variant="h5">
          {city}, {state}
        </Typography>
        <Typography variant="overline" color="GrayText">
          {venue}
        </Typography>
      </Stack> */}
      <SelectedEventView />
      <MapViewTabs />
      {/* <Box sx={{ my: 3 }}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            {" "}
            <TextField
              label="keyword search"
              placeholder="Starbucks"
              value={poiText}
              onChange={(e) => {
                setPoiText(e.target.value);
              }}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <Button onClick={handleSearchBox}>go</Button>
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
        </Grid>
      </Box>
      <Box>
        <GoogPlacesAc
          label="search near loc"
          handleSelectedPlace={(place) => {
            console.log("place", place);
          }}
          location={loc}
          radius={300}
          types={["airport"]}
        />
      </Box> */}
      {/* <DataView data={event} title="event" /> */}
    </div>
  );
};

export default EventBox;
