import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import Layout from "~/layout/Layout";

const EventIdPage = () => {
  const { query } = useRouter();

  const [event, setEvent] = useState();
  useEffect(() => {}, []);
  return (
    <Layout>
      <pre style={{ fontSize: 10 }}>{JSON.stringify(query, null, 2)}</pre>
    </Layout>
  );
};

export default EventIdPage;
