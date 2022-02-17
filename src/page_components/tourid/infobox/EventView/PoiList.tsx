import React from "react";
import { useSelector } from "@xstate/react";
import { useMapboxCtx } from "~/contexts/MapboxCtx";
import { Grid, Box, Chip } from "@mui/material";
import NextImage from "next/image";
import {
  CheckBox,
  SquareOutlined,
  CheckCircle,
  CircleOutlined,
} from "@mui/icons-material";
import DataView from "~/components/DataView";

const iconSize = 15;

const PoiList = () => {
  const { mapService } = useMapboxCtx();
  const event = useSelector(mapService, ({ context }) => context.selectedEvent);
  const map = useSelector(mapService, ({ context }) => context.map);
  const poiQ = useSelector(mapService, ({ context }) => context.poiQueries);
  const myPois = poiQ && event?.event_id && poiQ[event?.event_id];

  if (!event) return null;
  const { city, state, loc, event_id, venue, date } = event;

  return (
    <Grid item xs={12} sm={6} container>
      {myPois &&
        Object.entries(myPois).map(([queryString, { show, results }]) => {
          const handleClick = () => {
            mapService.send({
              type: "SHOW_HIDE_POIS",
              payload: { event_id, queryString, show: !show },
            });
          };
          const firstResult = results[0];
          const { icon } = firstResult;
          return (
            <Grid item>
              <Chip
                icon={
                  icon ? (
                    <Box
                      sx={{
                        border: "1px solid #DDD",
                        borderRadius: "50%",
                        width: 20,
                        height: 20,
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <NextImage
                        src={icon}
                        height={iconSize}
                        width={iconSize}
                      />
                    </Box>
                  ) : undefined
                }
                deleteIcon={show ? <CheckCircle /> : <CircleOutlined />}
                onDelete={handleClick}
                variant={show ? "filled" : "outlined"}
                label={queryString}
                key={queryString}
                clickable
                onClick={handleClick}
              />
            </Grid>
          );
        })}
      <DataView data={myPois} title="myPois" />
    </Grid>
  );
};

export default PoiList;
