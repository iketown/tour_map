import { CircularProgress, Dialog, DialogContent } from "@mui/material";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { googlePlaceParse } from "~/components/google/googlePlaceParse";
import { useTourCtx } from "~/contexts/TourCtx";
import { useMapCtx } from "~/utils/googleMap/MapWrap";
import EventForm from "./EventForm";
import {
  query as fbQuery,
  doc,
  where,
  collection,
  getDocs,
  getDoc,
} from "firebase/firestore";
import { db } from "~/utils/firebase/clientApp";
import { toDate, utcToZonedTime } from "date-fns-tz";
import { add } from "date-fns";

interface EventFormDialogI {
  renderButton?: ({
    openForm,
    hasTourEvent,
  }: {
    openForm: () => void;
    hasTourEvent: boolean;
  }) => React.ReactNode;
  children?: ({
    openForm,
    hasTourEvent,
  }: {
    openForm: () => void;
    hasTourEvent: boolean;
  }) => React.ReactNode;
  calEvent: CalEvent;
  tour_event_id?: string;
}
const EventFormDialog: React.FC<EventFormDialogI> = ({
  renderButton,
  children,
  calEvent,
  tour_event_id,
}) => {
  const [open, setOpen] = useState(false);
  const { tourInfo } = useTourCtx();
  const { query } = useRouter();
  const tour_id = query.tour_id as string;
  const { acService, placesService } = useMapCtx();
  const [loadingPlace, setLoadingPlace] = useState(false);
  const [place, setPlace] = useState<Place>();

  const { start, summary, location, id } = calEvent;

  const [tourEvent, setTourEvent] = useState<EventRecord | null>(null);

  useEffect(() => {
    if (!tour_id) return;
    if (tour_event_id) {
      getDoc(doc(db, "tours", tour_id, "events", tour_event_id)).then((doc) => {
        const _tourEvent = doc.data() as EventRecord;
        setTourEvent(_tourEvent);
      });
    } else {
      const q = fbQuery(
        collection(db, "tours", tour_id, "events"),
        where("goog_cal_id", "==", id)
      );
      getDocs(q).then(({ docs }) => {
        if (docs.length) {
          const _tourEvent = docs[0].data() as EventRecord;
          setTourEvent(_tourEvent);
        } else {
          setTourEvent(null);
        }
      });
    }
  }, [tour_id, tour_event_id, id]);

  useEffect(() => {
    if (!location) return;
    if (acService && placesService) {
      setLoadingPlace(true);
      acService.getPlacePredictions({ input: location }).then((result) => {
        if (result?.predictions && result.predictions[0]) {
          const { place_id } = result.predictions[0];
          placesService.getDetails({ placeId: place_id }, (_place) => {
            const parsedPlace = _place && (googlePlaceParse(_place) as Place);
            parsedPlace && setPlace(parsedPlace);
            setLoadingPlace(false);
          });
        } else {
          setLoadingPlace(false);
        }
      });
    }
  }, [location, acService, placesService]);
  const tz = "America/Chicago";
  const event: Partial<EventRecord> = tourEvent || {
    starts_at: add(utcToZonedTime(start.date, tz), { hours: 18 }),
    place,
    place_id: place?.place_id,
    goog_cal_id: id,
  };

  const openForm = () => {
    setOpen(true);
  };
  const closeForm = () => {
    setOpen(false);
  };
  if (loadingPlace) return <CircularProgress />;
  const hasTourEvent = !!tourEvent;
  return (
    <>
      <Dialog
        maxWidth="md"
        fullWidth
        open={open}
        onClose={() => setOpen(false)}
      >
        <DialogContent>
          <EventForm
            closeForm={closeForm}
            event={(event && place && { ...event, place }) || event || null}
          />
        </DialogContent>
      </Dialog>
      {renderButton && renderButton({ openForm, hasTourEvent })}
      {children && children({ openForm, hasTourEvent })}
    </>
  );
};

export default EventFormDialog;
