import { Divider, Typography } from "@mui/material";
import React from "react";
import { useMapboxCtx } from "~/contexts/MapboxCtx";
import { useTourCtx } from "~/contexts/TourCtx";

interface TravelDividerI {
  fromEventId?: string;
  toEventId?: string;
}

const TravelDivider: React.FC<TravelDividerI> = ({
  fromEventId,
  toEventId,
}) => {
  const { mapService } = useMapboxCtx();

  return (
    <Divider>
      <Typography
        sx={{ cursor: "pointer" }}
        onClick={() => {
          mapService.send({
            type: "SELECT_TRAVEL",
            payload: {
              fromEventId,
              toEventId,
            },
          });
        }}
        variant="overline"
        color="GrayText"
      >
        travel
      </Typography>
    </Divider>
  );
};

export default TravelDivider;
