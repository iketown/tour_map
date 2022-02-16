import { Box, Stack, Typography } from "@mui/material";
import { useSelector } from "@xstate/react";
import React, { useState } from "react";
import { useMapboxCtx } from "~/contexts/MapboxCtx";
import { useFlightFxns } from "~/hooks/travel/useFlightFxns";

const SelectedEventView = () => {
  const { mapService } = useMapboxCtx();
  const selectedEvent = useSelector(
    mapService,
    ({ context }) => context.selectedEvent
  );
  if (!selectedEvent) return null;
  const handleClick = () => {
    mapService.send({ type: "FOCUS_EVENT", payload: { selectedEvent } });
  };
  const { city, state, venue } = selectedEvent;

  return (
    <Box
      sx={{
        p: 1,
        cursor: "pointer",
      }}
      onClick={handleClick}
    >
      <Stack
        sx={{ border: "1px solid gainsboro", borderRadius: "1rem", p: 1 }}
        direction={"row"}
        justifyContent="space-between"
        spacing={2}
      >
        <Typography variant="h5">
          {city}, {state}
        </Typography>
        <Typography variant="overline" color="GrayText">
          {venue}
        </Typography>
      </Stack>
    </Box>
  );
};

export default SelectedEventView;
