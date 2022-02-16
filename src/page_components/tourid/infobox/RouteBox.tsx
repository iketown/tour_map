import { useSelector } from "@xstate/react";
import { useMapboxCtx } from "~/contexts/MapboxCtx";
import DataView from "~/components/DataView";
import { isEqual } from "lodash";
import { useTourCtx } from "~/contexts/TourCtx";
import { Box, Typography } from "@mui/material";
import { DoubleArrow } from "@mui/icons-material";

const RouteBox = () => {
  const { mapService } = useMapboxCtx();
  const { tourInfo } = useTourCtx();
  const { fromEventId, toEventId } = useSelector(
    mapService,
    ({ context }) => {
      const { fromEventId, toEventId } = context;
      return { fromEventId, toEventId };
    },
    isEqual
  );
  const fromEvent = fromEventId ? tourInfo?.events_basic[fromEventId] : null;
  const toEvent = toEventId ? tourInfo?.events_basic[toEventId] : null;
  let summary = (
    <Box sx={{ display: "flex", alignItems: "center" }}>
      <Typography component="span" variant="h5">
        {fromEvent?.city || "?"}
      </Typography>
      <Box sx={{ mx: 1, display: "flex", alignItems: "center" }}>
        <DoubleArrow color="disabled" />
      </Box>
      <Typography component="span" variant="h5">
        {toEvent?.city || ""}
      </Typography>
    </Box>
  );

  return (
    <div>
      {summary}
      <DataView data={{ fromEventId, toEventId }} title="from to ids" />
      <DataView data={tourInfo} title="tourInfo" />
    </div>
  );
};

export default RouteBox;
