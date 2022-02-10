//@ts-ignore
import { useCallback, useEffect, useState } from "react";
import ApiCalendar from "react-google-calendar-api";
import { format, add } from "date-fns";

const otherid = "c_phn1dltd29indm8nt3f4arhehk@group.calendar.google.com";

export const useGoogleCal = () => {
  const [calendar_id, set_calendar_id] = useState("iketown76@gmail.com");
  const [calEvents, setCalEvents] = useState<CalEvent[]>([]);
  const [isSignedIn, setSignedIn] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  useEffect(() => {
    ApiCalendar.onLoad(() => {
      setIsLoaded(true);
      if (ApiCalendar.sign) setSignedIn(true);
      ApiCalendar.listenSign((sign) => {
        setSignedIn(sign);
      });
    });
    return () => {
      setIsLoaded(false);
    };
  }, []);

  const createCalEvent = (
    { starts_at, title }: EventRecord,
    { lat, lng }: Place
  ) => {
    const eventObj = {
      start: { date: format(starts_at, "yyyy-MM-dd") },
      end: { date: format(add(starts_at, { days: 1 }), "yyyy-MM-dd") },
    };
    ApiCalendar.createEvent(eventObj);
  };

  const getEventById = (eventId: string) => {
    return ApiCalendar.getEvent(eventId, calendar_id);
  };

  const signIn = useCallback(() => {
    if (!isLoaded) return;
    ApiCalendar.handleAuthClick().then(() => {
      console.log("sign in success");
    });
  }, []);
  const signOut = useCallback(() => {
    ApiCalendar.handleSignoutClick();
  }, []);
  const listEvents = () => {
    if (!isLoaded) return;
    if (isSignedIn) {
      ApiCalendar.listUpcomingEvents(10, calendar_id).then(
        ({ result }: any) => {
          console.log("result", result);
          console.log(result.items);
          setCalEvents(result.items);
        }
      );
    }
  };
  const listEventsBetween = useCallback(
    ({ startDate, endDate }: { startDate: Date; endDate: Date }) => {
      if (!isLoaded || !isSignedIn) return;
      return ApiCalendar.listEvents({
        timeMin: startDate.toISOString(),
        timeMax: endDate.toISOString(),
        showDeleted: false,
      }).then((response) => {
        console.log("response", response);
        return response?.result?.items;
      });
    },
    [isLoaded, isSignedIn]
  );

  const updateKey = ({
    event_id,
    key,
    value,
  }: {
    event_id: string;
    key: string;
    value: any;
  }) => {
    console.log("updating", key, value);
  };

  const updateExtendedProps = async ({
    event_id,
    key,
    value,
  }: {
    event_id: string;
    key: string;
    value: string;
  }) => {
    const updateObj = {
      extendedProperties: {
        private: {
          [key]: value,
        },
      },
    };
    return ApiCalendar.updateEvent(updateObj, event_id, calendar_id)
      .then((response) => {
        console.log("api cal response update", response);
      })
      .catch((err) => {
        console.log("update ERROR", err);
      });
  };

  const getUserProfile = () => {
    const profile = ApiCalendar.getBasicUserProfile();
    console.log("profile", profile);
  };
  return {
    isLoaded,
    signIn,
    signOut,
    isSignedIn,
    calEvents,
    listEvents,
    listEventsBetween,
    updateKey,
    updateExtendedProps,
    getUserProfile,
    getEventById,
  };
};

// add to Google Cal event:
// place_id
// event_id
