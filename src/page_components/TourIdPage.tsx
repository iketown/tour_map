import { jsonEval } from "@firebase/util";
import { useRouter } from "next/router";
import React from "react";
import Layout from "~/layout/Layout";

const TourIdPage = () => {
  const { query } = useRouter();
  return (
    <Layout>
      <h3>Tour view</h3>
      <pre style={{ fontSize: 10 }}>{JSON.stringify(query, null, 2)}</pre>
    </Layout>
  );
};

export default TourIdPage;
