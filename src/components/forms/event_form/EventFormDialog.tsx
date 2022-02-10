import React, { Children, useEffect, useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogActions,
  DialogContent,
} from "@mui/material";
import EventForm from "./EventForm";
import { doc, getDoc, onSnapshot } from "firebase/firestore";
import { db } from "~/utils/firebase/clientApp";
import { useRouter } from "next/router";
import { useTourCtx } from "~/contexts/TourCtx";
interface EventFormDialogI {
  defaultDate?: Date;
  renderButton?: ({ openForm }: { openForm: () => void }) => React.ReactNode;
  children?: ({ openForm }: { openForm: () => void }) => React.ReactNode;
  event_id?: string;
}
const EventFormDialog: React.FC<EventFormDialogI> = ({
  renderButton,
  defaultDate,
  event_id,
  children,
}) => {
  const [open, setOpen] = useState(false);
  const { query } = useRouter();
  const tour_id = query.tour_id as string;

  const [event, setEvent] = useState<Partial<EventRecord>>();
  const [place, setPlace] = useState<Place>();

  useEffect(() => {
    if (!event_id || !tour_id || !open) return;
    let eventRecord: Partial<EventRecord> = {};
    const docRef = doc(db, "tours", tour_id, "events", event_id);
    const unsub = onSnapshot(docRef, (snap) => {
      eventRecord = { ...(snap.data() as EventRecord), event_id };
      setEvent(eventRecord);
    });
    return unsub;
  }, [event_id, tour_id, open]);

  useEffect(() => {
    if (!event?.place_id) return;
    const docRef = doc(db, "places", event.place_id);
    getDoc(docRef).then((doc) => {
      const _place = doc.data() as Place;
      setPlace(_place);
    });
  }, [event?.place_id]);

  const openForm = () => {
    setOpen(true);
  };
  const closeForm = () => {
    setOpen(false);
  };
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
            event={(event && place && { ...event, place }) || null}
            defaultDate={defaultDate}
          />
        </DialogContent>
      </Dialog>
      {renderButton && renderButton({ openForm })}
      {children && children({ openForm })}
    </>
  );
};

export default EventFormDialog;
