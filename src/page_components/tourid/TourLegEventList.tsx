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

// https://docs.mapbox.com/mapbox-gl-js/style-spec/layers/#line

const TourLegEventList = () => {
  const { tourInfo, tour_id } = useTourCtx();
  const { legObj, orderedEvents } = useLegs();
  const { selectedLeg, setSelectedLeg } = useMapboxCtx();
  // const eventsBasic = tourInfo?.events_basic;
  const lastGig =
    orderedEvents?.ordered &&
    orderedEvents.ordered[orderedEvents.ordered.length - 1];
  const lastDate = lastGig?.date;
  const [selectedEventId, setSelectedEventId] = useState("");
  return (
    <EventFormDialog event_id={selectedEventId}>
      {({ openForm }) => {
        const handleEditEvent = (event_id: string) => {
          setSelectedEventId(event_id);
          openForm();
        };
        return (
          <List sx={{ maxWidth: "400px" }} dense>
            {legObj &&
              Object.entries(legObj).map(([leg_id, leg]) => {
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
                      if (exp) {
                        setSelectedLeg(leg_id);
                      } else setSelectedLeg("");
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
                        {leg.events?.map((evt) => {
                          const {
                            city,
                            state,
                            country,
                            date,
                            venue,
                            tz,
                            event_id,
                          } = evt;
                          return (
                            <Fragment key={event_id}>
                              <ListItem>
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
                              </ListItem>
                              <Divider>
                                <Typography variant="overline" color="GrayText">
                                  4 hr drive
                                </Typography>
                              </Divider>
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
