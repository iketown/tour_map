import { styled } from "@mui/material/styles";
import React, { useCallback, useEffect, useState } from "react";
import { blue, yellow, blueGrey, red } from "@mui/material/colors";
import Layout from "~/layout/Layout";
import ReactCal from "react-calendar";
import {
  startOfMonth,
  startOfWeek,
  endOfMonth,
  endOfWeek,
  format,
} from "date-fns";
import { formatInTimeZone } from "date-fns-tz";
import { useGoogleCal } from "~/hooks/useGoogleCal.tsx/useGoogleCal";
import DataView from "~/components/DataView";
import { Button, Divider, Grid, Identity } from "@mui/material";
import EventGoogAdapterForm from "~/components/forms/event_form/EventGoogAdapterForm";
import { MapWrap } from "~/utils/googleMap/MapWrap";
import { TourCtxProvider, useTourCtx } from "~/contexts/TourCtx";
import { useRouter } from "next/router";
import classnames from "classnames";

const StyledCalendar = styled(ReactCal)`
  .gig_day,
  .unknown_gig {
    position: relative;
  }
  .gig_day:after {
    content: "";
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    z-index: 2;
    background-color: ${blue[200]};
    opacity: 0.4;
    border-radius: 100%;
    padding: 10px;
  }
  .unknown_gig:after {
    content: "";
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    z-index: 2;
    background-color: ${red[200]};
    opacity: 0.4;
    border-radius: 100%;
    padding: 10px;
  }

  .react-calendar__tile--active {
    background: ${blueGrey[600]};
  }
`;

interface CalEvtObj {
  [id: string]: CalEvent;
}

const GCalConnectPage = () => {
  const [date, setDate] = useState(startOfMonth(new Date()));
  const { tourInfo } = useTourCtx();
  const { listEventsBetween, getEventById, isLoaded, isSignedIn } =
    useGoogleCal();
  const [googGigs, setGoogGigs] = useState<CalEvtObj>({});
  const [todayGoogGigs, setTodayGoogGigs] = useState<{
    [id: string]: CalEvent;
  }>({});

  useEffect(() => {
    if (isSignedIn) {
      handleActiveDateChange(new Date());
    }
  }, [isSignedIn]);

  const handleChange = useCallback(
    async (newDate: Date, tz?: string) => {
      const formattedDate = tz
        ? formatInTimeZone(newDate, tz, "yyyy-MM-dd")
        : format(newDate, "yyyy-MM-dd");

      const gigsToday = Object.values(googGigs).reduce(
        (obj: CalEvtObj, calEvent) => {
          if (calEvent.start?.date === formattedDate) {
            obj[calEvent.id] = calEvent;
          }
          return obj;
        },
        {}
      );
      setTodayGoogGigs(gigsToday);
      setDate(newDate);
    },
    [googGigs]
  );

  const hasGoogGig = (date: Date, tz?: string) => {
    const formattedDate = tz
      ? formatInTimeZone(date, tz, "yyyy-MM-dd")
      : format(date, "yyyy-MM-dd");
    const hasGig = Object.values(googGigs).find(
      (gig) => gig.start?.date === formattedDate
    );
    return hasGig;
  };

  const hasUnknownGoogGig = (date: Date, tz?: string) => {
    const formattedDate = tz
      ? formatInTimeZone(date, tz, "yyyy-MM-dd")
      : format(date, "yyyy-MM-dd");
    const todayGigs = Object.values(googGigs).filter(
      (gig) => gig.start?.date === formattedDate
    );
    const knownGigs =
      todayGigs &&
      todayGigs.filter((gig) => {
        const googId = gig.id;
        const matchedGig =
          tourInfo &&
          Object.values(tourInfo.events_basic).find((eb) => {
            return eb?.goog_cal_id === googId;
          });
        return !!matchedGig;
      });

    return todayGigs.length && todayGigs.length !== knownGigs?.length;
  };

  const handleActiveDateChange = useCallback(
    async (activeStartDate: Date) => {
      const startDate = startOfWeek(activeStartDate);
      const endDate = endOfWeek(endOfMonth(activeStartDate));
      const _events = await listEventsBetween({ startDate, endDate });
      console.log("getting google stuff", startDate, endDate, _events);
      const googGigsUpdate = _events?.reduce(
        (obj: CalEvtObj, evt: CalEvent) => {
          obj[evt.id] = evt;
          return obj;
        },
        {}
      );
      setGoogGigs((old) => ({ ...old, ...googGigsUpdate }));
    },
    [listEventsBetween]
  );

  return (
    <Layout>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6}>
          <StyledCalendar
            calendarType="US"
            value={date}
            onClickDay={(newDate) => {
              console.log("clickday", newDate);
              handleChange(newDate);
            }}
            onActiveStartDateChange={({
              action,
              activeStartDate,
              value,
              view,
            }) => {
              console.log("active date", {
                action,
                activeStartDate,
                value,
                view,
              });
              handleActiveDateChange(activeStartDate);
            }}
            tileClassName={({ date }) => {
              return classnames({
                gig_day: hasGoogGig(date),
                unknown_gig: hasUnknownGoogGig(date),
              });
            }}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <DataView data={googGigs} title="googGigs" />
          {todayGoogGigs && (
            <DataView data={todayGoogGigs} title="todayGoogGigs" />
          )}
          {Object.entries(todayGoogGigs).map(([id, calEvent]) => {
            const tour_event_id =
              calEvent.extendedProperties?.private?.tour_event_id;
            return (
              <EventGoogAdapterForm
                key={id}
                calEvent={calEvent}
                renderButton={({ openForm, hasTourEvent }) => (
                  <Button
                    onClick={openForm}
                    variant={hasTourEvent ? "outlined" : "contained"}
                  >
                    {hasTourEvent ? "EDIT" : "CREATE TOUR EVENT"}
                  </Button>
                )}
              />
            );
          })}
          <DataView data={tourInfo} title="tourInfo" />
        </Grid>
      </Grid>
    </Layout>
  );
};

const WrappedGCalConnectPage = () => {
  const { query } = useRouter();
  const tour_id = query.tour_id as string;
  return (
    <TourCtxProvider {...{ tour_id }}>
      <MapWrap>
        <GCalConnectPage />
      </MapWrap>
    </TourCtxProvider>
  );
};

export default WrappedGCalConnectPage;
