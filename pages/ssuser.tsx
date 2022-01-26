import React from "react";
import type { FC } from "react";
import type { User } from "firebase/auth";
import { GetServerSideProps } from "next";
import Layout from "~/layout/Layout";
import { getUser } from "~/utils/firebase/serverApp";

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
        <pre style={{ fontSize: 12 }}>{JSON.stringify(user, null, 2)}</pre>
      ) : (
        <p>no user</p>
      )}
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
