import React from "react";
import {
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  ListItemIcon,
  ListItemSecondaryAction,
  IconButton,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from "@mui/material";
import { useTourCtx } from "~/contexts/TourCtx";
import EventFormDialog from "~/components/forms/event_form/EventFormDialog";
import NextLink from "next/link";
import { formatInTimeZone } from "date-fns-tz";
import { add } from "date-fns";
import DateIcon from "~/components/DateBox";
import { Edit } from "@mui/icons-material";
import { BiTrip } from "react-icons/bi";
import { useLegs } from "~/hooks/useLegs";

const TourEventList = () => {
  const { tourInfo, tour_id } = useTourCtx();
  const { legObj } = useLegs();
  const eventsBasic = tourInfo?.events_basic;
  const sortedEvents =
    (eventsBasic &&
      Object.entries(eventsBasic)
        .sort((a, b) => a[1].date - b[1].date)
        .map(([event_id, evt]) => evt)) ||
    [];
  const lastDate = sortedEvents[sortedEvents.length - 1]?.date;
  return (
    <List sx={{ maxWidth: "400px" }} dense>
      {sortedEvents.map((event) => {
        const { event_id } = event;
        return (
          <ListItem divider key={event_id}>
            <ListItemIcon sx={{ mr: 1 }}>
              <DateIcon date={event.date} tz={event.tz} />
            </ListItemIcon>
            <ListItemText
              primary={`${event.city} ${event.state || event.country}`}
              secondary={event.venue}
              secondaryTypographyProps={{
                style: {
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                },
              }}
            />
            <ListItemSecondaryAction>
              <NextLink
                key={event_id}
                href="/admin/tours/[tour_id]/events/[event_id]"
                as={`/admin/tours/${tour_id}/events/${event_id}`}
              >
                <IconButton>
                  <Edit />
                </IconButton>
              </NextLink>
            </ListItemSecondaryAction>
          </ListItem>
        );
      })}
      <EventFormDialog
        defaultDate={
          lastDate ? add(new Date(lastDate), { days: 1 }) : undefined
        }
        renderButton={({ openForm }) => (
          <ListItemButton onClick={openForm}>Add Event to Tour</ListItemButton>
        )}
      />
    </List>
  );
};

export default TourEventList;
