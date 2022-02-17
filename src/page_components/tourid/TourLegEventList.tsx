import { Edit, ExpandMore } from "@mui/icons-material";

import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Checkbox,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemSecondaryAction,
  ListItemText,
  Tooltip,
  Typography,
  Divider,
} from "@mui/material";
import { FaMapMarkerAlt, FaMapMarker } from "react-icons/fa";
import { CircleOutlined, Circle } from "@mui/icons-material";
import { add } from "date-fns";
import { formatInTimeZone } from "date-fns-tz";
import React, { useState, Fragment } from "react";
import { BiTrip } from "react-icons/bi";
import DateBox from "~/components/DateBox";
import EventFormDialog from "~/components/forms/event_form/EventFormDialog";
import { useMapboxCtx } from "~/contexts/MapboxCtx";
import { useTourCtx } from "~/contexts/TourCtx";
import { useLegs } from "~/hooks/useLegs";
import { useSelector } from "@xstate/react";
import TravelDivider from "./TravelDivider";

// https://docs.mapbox.com/mapbox-gl-js/style-spec/layers/#line

const TourLegEventList = () => {
  const { tourInfo, tour_id } = useTourCtx();
  const { legObj, orderedEvents } = useLegs();
  const {
    // selectedLeg,
    setSelectedLeg,
    // selectedEventId,
    selectEvent,
    mapService,
  } = useMapboxCtx();
  // const eventsBasic = tourInfo?.events_basic;
  const selectedEventId = useSelector(
    mapService,
    ({ context }) => context.selectedEventId
  );
  const selectedLeg = useSelector(
    mapService,
    ({ context }) => context.selectedLegId
  );

  const lastGig =
    orderedEvents?.ordered &&
    orderedEvents.ordered[orderedEvents.ordered.length - 1];
  const lastDate = lastGig?.date;

  return (
    <EventFormDialog event_id={selectedEventId || undefined}>
      {({ openForm }) => {
        const handleEditEvent = (event_id: string) => {
          selectEvent(event_id);
          openForm();
        };
        return (
          <List sx={{ maxWidth: "400px" }} dense>
            {legObj &&
              Object.entries(legObj).map(([leg_id, leg], legIndex, legArr) => {
                const isLastLeg = legIndex === legArr.length - 1;
                const isFirstLeg = legIndex === 0;
                const { first, last, color } = leg;
                const dateText = [first, last].map((gig) =>
                  formatInTimeZone(gig.date, gig.tz, "MMM d")
                );
                return (
                  <Accordion
                    sx={{
                      border: 1,
                      borderColor: color[100],
                    }}
                    key={leg_id}
                    expanded={selectedLeg === leg_id}
                    onChange={(e, exp) => {
                      mapService.send({
                        type: "TOGGLE_SELECTED_LEG",
                        payload: { leg_id, open: exp },
                      });
                    }}
                  >
                    <AccordionSummary
                      sx={{ display: "flex", alignItems: "center" }}
                      expandIcon={<ExpandMore sx={{ color: color[500] }} />}
                    >
                      <Box sx={{ mr: 1, color: color[500] }}>
                        {/* <Tooltip title="hide this leg"> */}
                        <IconButton
                          size="small"
                          sx={{
                            width: 25,
                            height: 25,
                            mr: 1,
                            color: color[600],
                          }}
                          onClick={(e) => {
                            e.stopPropagation();
                          }}
                        >
                          <FaMapMarker />
                        </IconButton>
                        {/* </Tooltip> */}
                      </Box>
                      <Typography>{dateText[0]}</Typography>
                      <Typography sx={{ color: "text.secondary", mx: 1 }}>
                        {" - "}
                      </Typography>
                      <Typography>{dateText[1]}</Typography>
                    </AccordionSummary>
                    <AccordionDetails
                      sx={{
                        maxHeight: "calc(100vh - 250px)",
                        overflow: "scroll",
                      }}
                    >
                      <List dense>
                        {leg.events?.map((evt, eventIndex, eventArr) => {
                          const {
                            city,
                            state,
                            country,
                            date,
                            venue,
                            tz,
                            event_id,
                          } = evt;
                          const isSelected = selectedEventId === event_id;
                          const nextEvent = eventArr[eventIndex + 1];
                          return (
                            <Fragment key={event_id}>
                              {eventIndex === 0 && (
                                <TravelDivider toEventId={event_id} />
                              )}
                              <ListItemButton
                                selected={isSelected}
                                onClick={() =>
                                  // selectEvent(isSelected ? "" : event_id)
                                  mapService.send({
                                    type: "TOGGLE_SELECTED_EVENT",
                                    payload: { event_id, open: !isSelected },
                                  })
                                }
                              >
                                <ListItemIcon sx={{ mr: 1 }}>
                                  <DateBox date={date} tz={tz} />
                                </ListItemIcon>
                                <ListItemText
                                  primary={`${city} ${state}`}
                                  secondary={venue}
                                />
                                <ListItemSecondaryAction>
                                  <IconButton
                                    onClick={() => {
                                      handleEditEvent(event_id);
                                    }}
                                  >
                                    <Edit />
                                  </IconButton>
                                </ListItemSecondaryAction>
                              </ListItemButton>
                              <TravelDivider
                                fromEventId={event_id}
                                toEventId={nextEvent ? nextEvent.event_id : ""}
                              />
                            </Fragment>
                          );
                        })}
                      </List>
                    </AccordionDetails>
                  </Accordion>
                );
              })}
            <EventFormDialog
              defaultDate={
                lastDate ? add(new Date(lastDate), { days: 1 }) : undefined
              }
              renderButton={({ openForm }) => (
                <ListItemButton onClick={openForm}>
                  Add Event to Tour
                </ListItemButton>
              )}
            />
          </List>
        );
      }}
    </EventFormDialog>
  );
};

export default TourLegEventList;
