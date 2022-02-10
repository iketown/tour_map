import {
  Divider,
  Grid,
  List,
  ListItemButton,
  ListItemText,
  ListSubheader,
  Typography,
} from "@mui/material";
import { endOfDay, isAfter, isBefore, startOfDay } from "date-fns";
import { toDate } from "date-fns-tz";
import format from "date-fns/format";
import { useRouter } from "next/router";
import React, { useCallback, useMemo, useState } from "react";
import DataView from "~/components/DataView";
import { useLegFxns } from "~/hooks/formHooks/useLegFxns";
import Layout from "~/layout/Layout";
import { fakeLegs } from "./fakeLegs";
import LegCalendar from "./LegCalendar";

interface LegsPageI {
  tourInfo: Tour;
}
const LegsPage: React.FC<LegsPageI> = ({ tourInfo }) => {
  const { query } = useRouter();
  const tour_id = query.tour_id as string;
  //   const { legs } = useLegFxns();
  const [legs, setLegs] = useState(fakeLegs);
  const [selectedLeg, setSelectedLeg] = useState("");
  const orderedEvents = useMemo(() => {
    if (!tourInfo?.events_basic) return {};
    const ordered = Object.entries(tourInfo.events_basic)
      .sort(([_, a], [__, b]) => a.date - b.date)
      .map(([id, obj]) => obj);
    const first = ordered[0];
    const last = ordered[ordered.length - 1];
    return { first, last, ordered };
  }, [tourInfo]);

  const [startDate, setStartDate] = useState(
    new Date(orderedEvents.first?.date)
  );
  const [endDate, setEndDate] = useState(new Date(orderedEvents.last?.date));

  const gigThisDay = useCallback(
    (date: Date) => {
      return orderedEvents.ordered?.find((evt) => {
        const leftEdge = startOfDay(date);
        const rightEdge = endOfDay(date);
        const gigDate = toDate(evt.date, { timeZone: evt.tz });
        return isAfter(gigDate, leftEdge) && isBefore(gigDate, rightEdge);
      });
    },
    [orderedEvents]
  );

  const inRange = useCallback(
    (date: Date) => {
      if (!selectedLeg) return false;
      const { start, end } = legs[selectedLeg] || {};
      return isAfter(date, startOfDay(start)) && isBefore(date, endOfDay(end));
    },
    [legs, selectedLeg]
  );

  return (
    <Layout>
      legs page
      <DataView title="tourInfo" data={tourInfo} />
      <DataView title="legs" data={legs} />
      <DataView title="orderedEvents" data={orderedEvents} />
      <Grid container spacing={2}>
        <Grid item xs={6}>
          <List>
            <ListSubheader>Legs</ListSubheader>
            {Object.entries(legs).map(([leg_id, { start, end, title }]) => {
              const handleClick = () => {
                setSelectedLeg(leg_id);
                setStartDate(start);
                setEndDate(end);
              };
              return (
                <ListItemButton
                  selected={leg_id === selectedLeg}
                  onClick={handleClick}
                  key={leg_id}
                >
                  <ListItemText
                    primary={title}
                    secondary={`${format(start, "MMM d")} - ${format(
                      end,
                      "MMM d"
                    )}`}
                  />
                </ListItemButton>
              );
            })}
            <ListItemButton>Add Leg</ListItemButton>
          </List>
        </Grid>
        <Grid item xs={6}>
          <Typography variant="h5">Start</Typography>
          <LegCalendar
            value={selectedLeg ? legs[selectedLeg].start : null}
            gigThisDay={gigThisDay}
            inRange={inRange}
            onClickDay={(date) => {
              if (!selectedLeg) return;
              setLegs((old) => ({
                ...old,
                [selectedLeg]: { ...old[selectedLeg], start: date },
              }));
            }}
            tileDisabled={(date) =>
              selectedLeg ? isAfter(date, legs[selectedLeg].end) : false
            }
          />
          <Divider sx={{ my: 2 }} />
          <Typography variant="h5">End</Typography>
          <LegCalendar
            value={selectedLeg ? legs[selectedLeg].end : null}
            gigThisDay={gigThisDay}
            inRange={inRange}
            onClickDay={(date) => {
              if (!selectedLeg) return;
              setLegs((old) => ({
                ...old,
                [selectedLeg]: { ...old[selectedLeg], end: date },
              }));
            }}
            tileDisabled={(date) =>
              selectedLeg ? isBefore(date, legs[selectedLeg].start) : false
            }
          />
        </Grid>
      </Grid>
    </Layout>
  );
};

export default LegsPage;
