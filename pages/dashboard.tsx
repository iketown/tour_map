import { DecodedIdToken } from "firebase-admin/lib/auth/token-verifier";
import { GetServerSideProps } from "next";
import React from "react";
import Layout from "~/layout/Layout";
import { getUser } from "~/utils/firebase/serverApp";
import DataView from "~/components/DataView";

interface DashboardPageI {
  user: DecodedIdToken;
}

const DashboardPage: React.FC<DashboardPageI> = (props) => {
  return (
    <Layout>
      <DataView data={props} title="props" />
      <h3>dashboard</h3>
    </Layout>
  );
};

export default DashboardPage;

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  try {
    const user = await getUser(ctx);
    return {
      props: {
        user,
      },
    };
  } catch (error) {
    console.log("dashboard error", error);
    return {
      props: {
        user: null,
      },
    };
  }
};
