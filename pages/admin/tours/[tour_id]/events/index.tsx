import { collection, onSnapshot } from "firebase/firestore";
import React, { useState, useEffect } from "react";
import { useAuthCtx } from "~/contexts/AuthCtx";
import { db } from "~/utils/firebase/clientApp";
import Layout from "~/layout/Layout";
import { Button, List, ListItem, ListItemButton } from "@mui/material";
import NextLink from "next/link";
import LinkButton from "~/components/LinkButton";
import { useRouter } from "next/router";
import TourEventList from "~/page_components/tourid/TourEventList";

const EventsIndex = () => {
  const [events, setEvents] = useState<{ [event_id: string]: EventRecord }>({});
  const { push } = useRouter();
  const { user_id } = useAuthCtx();
  useEffect(() => {
    if (!user_id) return;
    const eventsRef = collection(db, "users", user_id, "events");
    onSnapshot(eventsRef, (snap) => {
      const _newEvents: { [doc_id: string]: EventRecord } = {};
      snap.docChanges().forEach(({ doc }) => {
        const data = doc.data() as EventRecord;
        _newEvents[doc.id] = data;
      });
      setEvents((old) => ({ ...old, ..._newEvents }));
    });
  }, [user_id]);
  return (
    <Layout>
      <LinkButton href="/admin/events/add" variant="contained">
        Add Event
      </LinkButton>
      <TourEventList />
      <pre style={{ fontSize: 10 }}>{JSON.stringify(events, null, 2)}</pre>
    </Layout>
  );
};

export default EventsIndex;
