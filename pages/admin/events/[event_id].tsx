import { useRouter } from "next/router";
import React from "react";

const EventIdPage = () => {
  const { query } = useRouter();
  return (
    <div>
      event id page
      <pre style={{ fontSize: 10 }}>{JSON.stringify(query, null, 2)}</pre>
    </div>
  );
};

export default EventIdPage;
