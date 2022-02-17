import { useSelector } from "@xstate/react";
import { useMapboxCtx } from "~/contexts/MapboxCtx";
import DataView from "~/components/DataView";
import { isEqual } from "lodash";
import { useTourCtx } from "~/contexts/TourCtx";
import { Box, Button, Typography } from "@mui/material";
import { DoubleArrow } from "@mui/icons-material";
import { NextLinkComposed } from "~/components/Link";
import { useMapDirections } from "~/hooks/useMapDirections";

const RouteBox = () => {
  const { mapService } = useMapboxCtx();
  const { tourInfo, tour_id } = useTourCtx();
  const { getDirections } = useMapDirections();
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
        {fromEvent?.city || ""}
      </Typography>
      <Box sx={{ mx: 1, display: "flex", alignItems: "center" }}>
        <DoubleArrow color="disabled" />
      </Box>
      <Typography component="span" variant="h5">
        {toEvent?.city || ""}
      </Typography>
    </Box>
  );

  const fromText = fromEvent ? (
    <Typography component="span">
      from <b>{fromEvent.city}</b>
    </Typography>
  ) : (
    ""
  );
  const toText = toEvent ? (
    <Typography component="span">
      to <b>{toEvent.city}</b>
    </Typography>
  ) : (
    ""
  );

  const getDir = () => {
    if (!fromEvent || !toEvent) return;
    getDirections([fromEvent.loc, toEvent.loc]);
  };

  return (
    <div>
      {summary}
      <Box>
        {fromEvent && toEvent && (
          <Button onClick={getDir}>driving directions</Button>
        )}
      </Box>
      {tour_id && (
        <NextLinkComposed
          href="/admin/tours/[tour_id]/travel"
          to={`/admin/tours/${tour_id}/travel?o=${fromEventId}&d=${toEventId}`}
        >
          <Typography>
            Edit travel {fromText} {toText}{" "}
          </Typography>
        </NextLinkComposed>
      )}
      {/* <DataView data={{ fromEventId, toEventId }} title="from to ids" /> */}
      {/* <DataView data={tourInfo} title="tourInfo" /> */}
    </div>
  );
};

export default RouteBox;
