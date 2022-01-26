import React from "react";
import type { FC } from "react";
import type { User } from "firebase/auth";
import { GetServerSideProps } from "next";
import Layout from "~/layout/Layout";
import { getUser } from "~/utils/firebase/serverApp";
import { Typography } from "@mui/material";
import Link from "~/components/Link";

interface ServerSideUserI {
  user?: User;
  foo: string;
  itWorked: string;
}
const ServerSideUser: FC<ServerSideUserI> = ({ user, foo, itWorked }) => {
  return (
    <Layout>
      <p>
        the value of foo is <b>{foo}</b>
      </p>
      <p>
        the value of itWorked is <b>{itWorked}</b>
      </p>
      {user ? (
        <pre style={{ fontSize: 12, color: "maroon" }}>
          {JSON.stringify(user, null, 2)}
        </pre>
      ) : (
        <p>no user</p>
      )}
      <Typography>
        if you want to check redirects for unAuthed person, try signing out and
        navigating to <Link href="/nouser">SSR Docs</Link>
      </Typography>
    </Layout>
  );
};

export default ServerSideUser;

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const foo = "bar";
  const { user, itWorked } = await getUser(ctx);
  return {
    props: { foo, itWorked, user },
  };
};
