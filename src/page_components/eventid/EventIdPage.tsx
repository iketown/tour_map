import { DecodedIdToken } from "firebase-admin/lib/auth/token-verifier";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import Layout from "~/layout/Layout";
import EventForm from "~/components/forms/event_form/EventForm";
import { Button, Box } from "@mui/material";
import { useTourCtx } from "~/contexts/TourCtx";
import { TourCtxProvider } from "~/contexts/TourCtx";
import { MapWrap } from "~/utils/googleMap/MapWrap";
import type { ParsedUrlQuery } from "querystring";
import LinkButton from "~/components/LinkButton";
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "~/utils/firebase/clientApp";

export interface EventIdPageI {
  user: DecodedIdToken | null;
  tour_id: string;
  eventRecord: EventRecord | null;
  tourInfo: Tour | null;
}

interface EventQuery extends ParsedUrlQuery {
  event_id: string;
  tour_id: string;
}

const EventIdPage: React.FC<EventIdPageI> = ({ user, eventRecord }) => {
  const { query } = useRouter();
  const { tour_id, event_id } = query as EventQuery;
  const { tourInfo } = useTourCtx();
  const [event, setEvent] = useState<EventRecord | null>(eventRecord);

  useEffect(() => {
    // listen for changes to this event
    const unsub = onSnapshot(
      doc(db, "tours", tour_id, "events", event_id),
      (doc) => {
        const _event = doc.data() as EventRecord;
        console.log({ _event });
        setEvent({ ..._event, event_id });
      }
    );
    return unsub;
  }, [tour_id, event_id]);

  return (
    <Layout>
      <Box>
        <Button>prev event</Button>
        <LinkButton
          variant="outlined"
          href="/admin/tours/[tour_id]"
          as={`/admin/tours/${tour_id}`}
        >
          {tourInfo?.title}
        </LinkButton>
        <Button>next event</Button>
      </Box>
      <EventForm event={event ? event : undefined} />
      {/* <pre style={{ fontSize: 10 }}>{JSON.stringify(query, null, 2)}</pre>
      <pre style={{ fontSize: 10 }}>{JSON.stringify(eventRecord, null, 2)}</pre> */}
    </Layout>
  );
};

const WrappedEventPage: React.FC<EventIdPageI> = (props) => {
  return (
    <MapWrap>
      <TourCtxProvider tour_id={props.tour_id}>
        <EventIdPage {...props} />
      </TourCtxProvider>
    </MapWrap>
  );
};
export default WrappedEventPage;
