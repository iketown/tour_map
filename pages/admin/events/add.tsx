import React from "react";
import Layout from "~/layout/Layout";
import EventForm from "~/components/forms/EventForm";
import LinkButton from "~/components/LinkButton";
const AddEventPage = () => {
  return (
    <Layout>
      <h4>Add Event</h4>
      <LinkButton href="/admin/events">all events</LinkButton>
      <EventForm />
    </Layout>
  );
};

export default AddEventPage;
